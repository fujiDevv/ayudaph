import { parseBranches, type Branch } from "./locator";

// Independent public instances; the old lz4/z aliases are no longer supported.
export const OVERPASS_ENDPOINTS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

// Allow the 15-second query budget, admission queue, and connection/transfer
// time. A live Manila viewport took 26 seconds despite a successful response.
export const BRANCH_REQUEST_TIMEOUT_MS = 40_000;

export async function fetchBranches(bbox: string, signal: AbortSignal): Promise<Branch[]> {
  const query = `[out:json][timeout:15];
    nwr["office"~"^(government|insurance)$"]["name"~"DSWD|PhilHealth|Pag-IBIG|Pag IBIG|SSS|Social Security System|GSIS|Government Service Insurance|DOLE|Department of Labor|DOH|Department of Health|OWWA|Overseas Workers",i](${bbox});
    out center;`;
  let lastError: unknown = new Error("Branch search unavailable");
  for (const endpoint of OVERPASS_ENDPOINTS) {
    if (signal.aborted) throw new DOMException("Search cancelled", "AbortError");
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(cancel, BRANCH_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new URLSearchParams({ data: query }),
        headers: { "User-Agent": "AyudaPH/1.0 (https://ayudaph.org)" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Branch server returned ${response.status}`);
      return parseBranches(await response.json());
    } catch (error) {
      if (signal.aborted) throw error;
      console.warn("Ayuda: branch provider unavailable", endpoint, error);
      lastError = error;
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
    }
  }
  throw lastError;
}
