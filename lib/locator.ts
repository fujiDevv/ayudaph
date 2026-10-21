import { isRecord } from "./storage";

export interface Branch {
  id: string;
  agency: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export interface PsgcEntry { code: string; name: string }

export function isPsgcEntries(value: unknown): value is PsgcEntry[] {
  return Array.isArray(value) && value.every(entry => isRecord(entry) &&
    typeof entry.code === "string" && typeof entry.name === "string");
}

export function isCoordinates(value: unknown): value is { lat: number; lng: number } {
  return isRecord(value) && typeof value.lat === "number" && Number.isFinite(value.lat) &&
    typeof value.lng === "number" && Number.isFinite(value.lng) &&
    Math.abs(value.lat) <= 90 && Math.abs(value.lng) <= 180;
}

export function isBranches(value: unknown): value is Branch[] {
  return Array.isArray(value) && value.every(entry => isCoordinates(entry) &&
    ["id", "agency", "name", "address"].every(key => typeof (entry as unknown as Record<string, unknown>)[key] === "string"));
}

/** Leaflet accepts an element, so untrusted map data never needs HTML parsing. */
export function createBranchPopup(branch: Branch, badgeClass: string): HTMLElement {
  const popup = document.createElement("div");
  popup.className = "font-sans min-w-[200px] p-0.5";
  for (const [tag, className, text] of [
    ["h3", "font-bold text-gray-900 text-[15px] leading-tight", branch.name],
    ["p", "text-[11px] text-gray-500 mt-1.5 leading-relaxed", branch.address],
    ["div", `mt-2.5 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-block text-white ${badgeClass}`, branch.agency],
  ]) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    popup.append(element);
  }
  return popup;
}

/** Aborting saves work; the generation check also rejects already-resolved requests. */
export function createLatestRequest() {
  let generation = 0;
  let controller: AbortController | undefined;
  const cancel = () => { generation++; controller?.abort(); };
  return {
    cancel,
    start() {
      cancel();
      controller = new AbortController();
      const current = generation;
      return { signal: controller.signal, isCurrent: () => current === generation };
    },
  };
}

function classifyAgency(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("dswd")) return "DSWD";
  if (lower.includes("philhealth")) return "PhilHealth";
  if (lower.includes("pag-ibig") || lower.includes("pag ibig")) return "Pag-IBIG";
  if (lower.includes("sss") || lower.includes("social security system")) return "SSS";
  if (lower.includes("gsis") || lower.includes("government service insurance")) return "GSIS";
  if (lower.includes("dole") || lower.includes("department of labor")) return "DOLE";
  if (lower.includes("doh") || lower.includes("department of health")) return "DOH";
  if (lower.includes("owwa") || lower.includes("overseas workers")) return "OWWA";
  return "Other";
}

export function parseBranches(data: unknown): Branch[] {
  if (!isRecord(data) || !Array.isArray(data.elements) || data.remark) {
    throw new Error("Incomplete branch response");
  }
  return data.elements.flatMap((element): Branch[] => {
    if (!isRecord(element) || typeof element.id !== "number" || !isRecord(element.tags)) return [];
    const center = isRecord(element.center) ? element.center : {};
    const coords = { lat: element.lat ?? center.lat, lng: element.lon ?? center.lon };
    if (!isCoordinates(coords) || typeof element.tags.name !== "string") return [];
    const tags = element.tags;
    const name = tags.name as string;
    const address = ["addr:housenumber", "addr:street", "addr:city"]
      .map(key => tags[key])
      .filter(value => typeof value === "string")
      .join(", ") || "No address provided";
    return [{ id: String(element.id), agency: classifyAgency(name), name, ...coords, address }];
  });
}
