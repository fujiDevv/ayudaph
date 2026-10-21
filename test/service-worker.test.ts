import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

function response(body: string, contentType = "text/html", status = 200) {
  const result = new Response(body, { status, headers: { "content-type": contentType } });
  Object.defineProperty(result, "type", { value: "basic" });
  return result;
}

function worker() {
  const entries = new Map<string, Response>();
  const handlers: Record<string, (event: unknown) => void> = {};
  const fetch = vi.fn<(request: Request) => Promise<Response>>();
  const keyOf = (request: Request | string) => typeof request === "string"
    ? new URL(request, "https://ayudaph.org").href : request.url;
  const put = vi.fn(async (request: Request, result: Response) => { entries.set(keyOf(request), result); });
  const caches = {
    open: async () => ({ put }),
    match: vi.fn(async (request: Request | string) => entries.get(keyOf(request))?.clone()),
  };
  runInNewContext(readFileSync(new URL("../public/sw.js", import.meta.url), "utf8"), {
    self: { location: { origin: "https://ayudaph.org" }, addEventListener: (name: string, fn: (event: unknown) => void) => { handlers[name] = fn; } },
    fetch, caches, URL, Request, Response,
  });
  function dispatch(path: string, mode = "navigate", headers: Record<string, string> = {}, destination = "") {
    const request = new Request(new URL(path, "https://ayudaph.org"), { headers });
    Object.defineProperties(request, { mode: { value: mode }, destination: { value: destination } });
    let result: Promise<Response> | undefined;
    const pending: Promise<unknown>[] = [];
    handlers.fetch({ request, respondWith: (value: Promise<Response>) => { result = value; }, waitUntil: (value: Promise<unknown>) => pending.push(value) });
    return { request, result, pending };
  }
  return { entries, fetch, put, caches, dispatch };
}

describe("offline routes", () => {
  it("returns the offline page instead of unrelated homepage HTML", async () => {
    const w = worker();
    w.entries.set("https://ayudaph.org/", response("home"));
    w.entries.set("https://ayudaph.org/offline", response("offline"));
    w.fetch.mockRejectedValue(new Error("offline"));
    expect(await (await w.dispatch("/shortlist").result)!.text()).toBe("offline");
  });

  it("caches and reuses exact RSC payloads without mixing prefetch variants", async () => {
    const w = worker();
    w.entries.set("https://ayudaph.org/offline", response("offline"));
    w.fetch.mockResolvedValueOnce(response("route payload", "text/x-component"));
    const path = "/shortlist.rsc?_rsc=navigation";
    expect(await (await w.dispatch(path, "cors", { RSC: "1" }).result)!.text()).toBe("route payload");
    w.fetch.mockRejectedValue(new Error("offline"));
    expect(await (await w.dispatch(path, "cors", { RSC: "1" }).result)!.text()).toBe("route payload");
    expect(await (await w.dispatch("/shortlist.rsc?_rsc=prefetch", "cors", { RSC: "1" }).result)!.text()).toBe("offline");
  });

  it("does not overwrite good cached pages with server errors", async () => {
    const w = worker();
    w.entries.set("https://ayudaph.org/shortlist", response("saved page"));
    w.fetch.mockResolvedValue(response("server error", "text/html", 503));
    expect(await (await w.dispatch("/shortlist").result)!.text()).toBe("saved page");
    expect(w.put).not.toHaveBeenCalled();
  });

  it("serves network responses even when the cache is full", async () => {
    const w = worker();
    w.put.mockRejectedValue(new Error("quota"));
    w.fetch.mockResolvedValue(response("online page"));
    expect(await (await w.dispatch("/shortlist").result)!.text()).toBe("online page");
  });

  it("keeps asset refresh work alive and ignores external services", async () => {
    const w = worker();
    w.entries.set("https://ayudaph.org/assets/app.js", response("cached asset"));
    w.fetch.mockResolvedValue(response("new asset"));
    const event = w.dispatch("/assets/app.js", "cors", {}, "script");
    expect(await (await event.result)!.text()).toBe("cached asset");
    expect(event.pending).toHaveLength(1);
    await Promise.all(event.pending);
    expect(w.put).toHaveBeenCalled();
    expect(w.dispatch("https://overpass-api.de/api/interpreter", "cors").result).toBeUndefined();
  });
});
