import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BRANCH_REQUEST_TIMEOUT_MS, fetchBranches, OVERPASS_ENDPOINTS } from "@/lib/branches";

const bbox = "14.57,121,14.63,121.07";
const payload = { elements: [
  { type: "node", id: 1, lat: 14.6, lon: 121.03, tags: { name: "SSS", "addr:street": "Main Street" } },
  { type: "way", id: 2, center: { lat: 14.61, lon: 121.04 }, tags: { name: "PhilHealth" } },
] };
const json = (body: unknown) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });

beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("branch lookup", () => {
  it("allows a successful response taking longer than the old six-second deadline", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn((_url: string, init: RequestInit) => new Promise<Response>((resolve, reject) => {
      setTimeout(() => resolve(json(payload)), 26_000);
      init.signal?.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")));
    }));
    vi.stubGlobal("fetch", fetch);
    const result = fetchBranches(bbox, new AbortController().signal);
    await vi.advanceTimersByTimeAsync(26_000);
    expect(await result).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("fails over between independent instances on HTTP and partial query errors", async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response("Busy", { status: 429 }))
      .mockResolvedValueOnce(json({ elements: [], remark: "runtime error: Query timed out" }))
      .mockResolvedValueOnce(json(payload));
    vi.stubGlobal("fetch", fetch);
    const result = await fetchBranches(bbox, new AbortController().signal);
    expect(result).toEqual([
      { id: "1", agency: "SSS", name: "SSS", lat: 14.6, lng: 121.03, address: "Main Street" },
      { id: "2", agency: "PhilHealth", name: "PhilHealth", lat: 14.61, lng: 121.04, address: "No address provided" },
    ]);
    expect(fetch.mock.calls.map(call => call[0])).toEqual(OVERPASS_ENDPOINTS);
    for (const [, options] of fetch.mock.calls) {
      expect(options.method).toBe("POST");
      expect(options.body.get("data")).toContain(`[timeout:15]`);
      expect(options.body.get("data")).toContain(bbox);
    }
  });

  it("keeps the timeout active until the response body finishes", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn()
      .mockImplementationOnce((_url: string, init: RequestInit) => Promise.resolve({
        ok: true,
        json: () => new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")));
        }),
      }))
      .mockResolvedValueOnce(json(payload));
    vi.stubGlobal("fetch", fetch);
    const pending = fetchBranches(bbox, new AbortController().signal);
    await vi.advanceTimersByTimeAsync(BRANCH_REQUEST_TIMEOUT_MS);
    expect(await pending).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels superseded searches without querying more providers", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const fetch = vi.fn((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => reject(new DOMException("Cancelled", "AbortError")));
    }));
    vi.stubGlobal("fetch", fetch);
    const pending = fetchBranches(bbox, controller.signal);
    const assertion = expect(pending).rejects.toMatchObject({ name: "AbortError" });
    controller.abort();
    await assertion;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("accepts a genuine empty result and ignores malformed map features", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ elements: [] }))
      .mockResolvedValueOnce(json({ elements: [null, {}, { id: 5, tags: { name: "SSS" } }, ...payload.elements] }));
    vi.stubGlobal("fetch", fetch);
    expect(await fetchBranches(bbox, new AbortController().signal)).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(await fetchBranches(bbox, new AbortController().signal)).toHaveLength(2);
  });

  it("reports a total outage rather than returning a cacheable empty result", async () => {
    const fetch = vi.fn().mockImplementation(async () => json({ remark: "database unavailable" }));
    vi.stubGlobal("fetch", fetch);
    await expect(fetchBranches(bbox, new AbortController().signal)).rejects.toThrow("Incomplete branch response");
    expect(fetch).toHaveBeenCalledTimes(OVERPASS_ENDPOINTS.length);
  });
});
