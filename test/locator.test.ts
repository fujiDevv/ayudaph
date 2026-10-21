import { afterEach, expect, it, vi } from "vitest";
import { createBranchPopup, createLatestRequest, isBranches, isCoordinates, isPsgcEntries } from "@/lib/locator";

afterEach(() => vi.unstubAllGlobals());

it("renders hostile map data exclusively as text", () => {
  const createElement = (tag: string) => ({ tag, className: "", textContent: "", children: [] as unknown[],
    append(child: unknown) { this.children.push(child); },
    set innerHTML(_value: string) { throw new Error("HTML parsing is forbidden"); },
  });
  vi.stubGlobal("document", { createElement });
  const hostile = '<img src=x onerror="alert(1)">';
  const popup = createBranchPopup({ id: "1", name: hostile, address: hostile, agency: hostile, lat: 14, lng: 121 }, "bg-blue-600") as unknown as ReturnType<typeof createElement>;
  expect(popup.children).toHaveLength(3);
  for (const child of popup.children as ReturnType<typeof createElement>[]) {
    expect(child.textContent).toBe(hostile);
    expect(child.children).toEqual([]);
  }
});

it("rejects stale responses even if a fetch ignores cancellation", async () => {
  const requests = createLatestRequest();
  let finish!: () => void;
  const first = requests.start();
  let displayed = "";
  const pending = new Promise<void>(resolve => { finish = resolve; }).then(() => {
    if (first.isCurrent()) displayed = "old region";
  });
  const second = requests.start();
  if (second.isCurrent()) displayed = "new region";
  finish();
  await pending;
  expect(first.signal.aborted).toBe(true);
  expect(displayed).toBe("new region");
  requests.cancel();
  expect(second.signal.aborted).toBe(true);
  expect(second.isCurrent()).toBe(false);
});

it("rejects malformed map caches", () => {
  expect(isBranches([null])).toBe(false);
  expect(isBranches({})).toBe(false);
  expect(isCoordinates({ lat: NaN, lng: 121 })).toBe(false);
  expect(isCoordinates({ lat: 91, lng: 121 })).toBe(false);
  expect(isPsgcEntries([{ code: "1", name: "Region" }])).toBe(true);
  expect(isPsgcEntries([{ code: 1 }])).toBe(false);
});
