import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/branches/route";

beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const request = (bbox?: string) => new Request(`https://ayudaph.org/api/branches${bbox === undefined ? "" : `?bbox=${encodeURIComponent(bbox)}`}`);

describe("branch API route", () => {
  it("rejects invalid or excessively large bounds before calling public APIs", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    for (const bbox of [undefined, "", "14,121,NaN,122", "14,,15,122", "15,121,14,122", "-91,121,-90,122", "14,121,16,123", "14,121,15,122);out;"]) {
      expect((await GET(request(bbox))).status).toBe(400);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns branch data and permits short-lived caching", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ elements: [
      { id: 1, lat: 14.6, lon: 121.03, tags: { name: "SSS" } },
    ] }))));
    const response = await GET(request("14.57,121,14.63,121.07"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("max-age=300");
    expect(await response.json()).toEqual([
      { id: "1", lat: 14.6, lng: 121.03, agency: "SSS", name: "SSS", address: "No address provided" },
    ]);
  });

  it("never caches provider outages as successful empty searches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response("Unavailable", { status: 503 })));
    const response = await GET(request("14.57,121,14.63,121.07"));
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ error: "Branch search temporarily unavailable" });
  });
});
