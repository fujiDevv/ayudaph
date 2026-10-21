import { afterEach, describe, expect, it, vi } from "vitest";
import { programs } from "@/data/constants";
import en from "@/lib/i18n/en.json";
import tl from "@/lib/i18n/tl.json";
import { migrateRequirements, normalizeSavedPrograms } from "@/lib/requirements";
import { booleanRecord, readStorage, readStoredJSON, writeStoredJSON, removeStorage } from "@/lib/storage";

afterEach(() => vi.unstubAllGlobals());

describe("persistent visitor state", () => {
  it("continues when storage access is blocked or full", () => {
    vi.stubGlobal("window", { get localStorage() { throw new Error("blocked"); } });
    expect(readStorage("key")).toBeNull();
    expect(readStoredJSON("key")).toBeNull();
    expect(() => writeStoredJSON("key", [])).not.toThrow();
    expect(() => removeStorage("key")).not.toThrow();
    vi.stubGlobal("window", { localStorage: { setItem() { throw new Error("quota"); } } });
    expect(() => writeStoredJSON("key", [])).not.toThrow();
  });

  it("rejects corrupt JSON and invalid state shapes", () => {
    vi.stubGlobal("window", { localStorage: { getItem: () => "{invalid" } });
    expect(readStoredJSON("key")).toBeNull();
    for (const value of [null, false, "text", 123, {}]) {
      expect(normalizeSavedPrograms(value)).toEqual([]);
      expect(migrateRequirements(value)).toEqual({});
    }
    expect(booleanRecord({ valid: true, bad: "false" })).toEqual({ valid: true });
    expect(booleanRecord(null)).toEqual({});
  });

  it("preserves known saved programs and drops duplicates and retired IDs", () => {
    expect(normalizeSavedPrograms([programs[0].id, null, "retired", programs[0].id]))
      .toEqual([programs[0].id]);
  });

  it("merges English and Tagalog checkmarks into one permanent ID", () => {
    const program = programs[0];
    const id = program.id as keyof typeof en.programs;
    const migrated = migrateRequirements({ [id]: [
      ...en.programs[id].requirements, ...tl.programs[id].requirements,
      ...program.requirement_ids, "removed requirement", null,
    ] });
    expect(migrated[id]).toEqual(program.requirement_ids);
    expect(migrated[id].length / program.requirements.length * 100).toBe(100);
    expect(migrateRequirements(migrated)).toEqual(migrated);
  });
});
