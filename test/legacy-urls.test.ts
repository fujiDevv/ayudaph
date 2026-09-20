import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";
import { programs } from "@/data/constants";

/**
 * Program ids are part of this site's public URLs (`/programs/:id`, plus the
 * short-form `/program/:id` alias). Renaming an id silently breaks inbound
 * links and search-engine indexes, so the list is locked here deliberately.
 * If you are renaming one on purpose, update this list and add a redirect in
 * `next.config.ts` for the retired id.
 */
const PUBLIC_PROGRAM_IDS = [
  "ched-tes",
  "doh-maip",
  "dole-tupad",
  "dswd-4ps",
  "dswd-aics",
  "dswd-spisc",
  "gsis-funeral",
  "gsis-retirement",
  "lgu-soloparent",
  "owwa-edsp",
  "pagibig-housing",
  "pagibig-mpl",
  "philhealth-newborn",
  "philhealth-yakap",
  "sss-funeral",
  "sss-maternity",
  "sss-retirement",
  "sss-sickness",
  "sss-unemp",
  "tesda-training",
];

async function loadRedirects() {
  if (typeof nextConfig.redirects === "function") return nextConfig.redirects();
  return nextConfig.redirects ?? [];
}

describe("legacy program URLs", () => {
  it("keeps the permanent /program/:id -> /programs/:id redirect", async () => {
    const redirects = await loadRedirects();
    const rule = redirects.find((entry) => entry.source === "/program/:id");

    expect(rule, "next.config.ts must keep the /program/:id redirect").toBeDefined();
    expect(rule?.destination).toBe("/programs/:id");
    // vinext only reads `permanent`; statusCode is ignored, so this must stay true.
    expect(rule?.permanent).toBe(true);
  });

  it("does not redirect the current /programs/:id route, which would loop", async () => {
    const redirects = await loadRedirects();
    expect(redirects.some((entry) => entry.source === "/programs/:id")).toBe(false);
  });

  it("sends every www request to the canonical apex host", async () => {
    const redirects = await loadRedirects();
    const rule = redirects.find((entry) =>
      entry.has?.some(
        (condition) => condition.type === "host" && condition.value === "www.ayudaph.org",
      ),
    );

    expect(rule, "a www -> apex host redirect is required").toBeDefined();
    expect(rule?.destination).toBe("https://ayudaph.org/:path*");
    expect(rule?.permanent).toBe(true);
  });

  it("declares the host redirect before the path redirect", async () => {
    // Next.js applies only the first matching redirect. If the /program/:id
    // rule came first, a www request under that path would redirect within www
    // and need a second round trip to reach the apex.
    const redirects = await loadRedirects();
    const hostRule = redirects.findIndex((entry) => entry.has !== undefined);
    const pathRule = redirects.findIndex((entry) => entry.source === "/program/:id");

    expect(hostRule).toBeGreaterThanOrEqual(0);
    expect(pathRule).toBeGreaterThanOrEqual(0);
    expect(hostRule).toBeLessThan(pathRule);
  });

  it("locks the public program ids", () => {
    expect(programs.map((program) => program.id).sort()).toEqual(
      [...PUBLIC_PROGRAM_IDS].sort(),
    );
  });

  it("keeps every id URL-safe so the redirect param resolves", () => {
    programs.forEach((program) => {
      expect(program.id, `${program.id} must be url-safe`).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      );
    });
  });
});
