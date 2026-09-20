import { describe, expect, it } from "vitest";
import { programs } from "@/data/constants";
import {
  EMPTY_FILTERS,
  filterPrograms,
  hasActiveFilters,
  splitCategory,
} from "@/lib/filtering";
import type { Program } from "@/lib/types";

const sample: Program[] = [
  {
    id: "a",
    agency: "DSWD",
    name: "Pantawid Pamilyang Pilipino Program (4Ps)",
    category: "Financial / Education / Health",
    description: "Conditional cash grants for the poorest households.",
    target_audience: ["Indigent", "Families"],
    processing_time: "Varies",
    official_url: "https://www.dswd.gov.ph",
    steps: ["Wait for assessment"],
    requirements: ["Listahanan classification"],
    tags: ["financial", "education"],
  },
  {
    id: "b",
    agency: "SSS",
    name: "Retirement Benefit",
    category: "Pension / Retirement",
    description: "Lifetime monthly pension for retired SSS members.",
    target_audience: ["Retirees", "SSS Members"],
    processing_time: "15-20 working days",
    official_url: "https://www.sss.gov.ph",
    steps: ["File online"],
    requirements: ["120 contributions"],
    tags: ["pension", "retirement"],
  },
];

describe("splitCategory", () => {
  it("splits compound categories and trims whitespace", () => {
    expect(splitCategory("Financial / Education / Health")).toEqual([
      "Financial",
      "Education",
      "Health",
    ]);
  });

  it("returns a single value unchanged", () => {
    expect(splitCategory("Pension")).toEqual(["Pension"]);
  });

  it("drops empty segments", () => {
    expect(splitCategory("Financial /  / Health")).toEqual([
      "Financial",
      "Health",
    ]);
  });
});

describe("hasActiveFilters", () => {
  it("is false for the empty filter set", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  it("is true when any single filter is set", () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, query: "aics" })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, agency: "DSWD" })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, category: "Health" })).toBe(true);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, audience: "Seniors" })).toBe(true);
  });
});

describe("filterPrograms", () => {
  it("returns everything when no filters are applied", () => {
    expect(filterPrograms(sample, EMPTY_FILTERS)).toHaveLength(2);
  });

  it("matches keywords against name and description case-insensitively", () => {
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, query: "retirement" }),
    ).toHaveLength(1);
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, query: "PENSION" }),
    ).toHaveLength(1);
  });

  it("matches keywords against tags and target audiences", () => {
    expect(filterPrograms(sample, { ...EMPTY_FILTERS, query: "4ps" })).toHaveLength(1);
    expect(filterPrograms(sample, { ...EMPTY_FILTERS, query: "families" })).toHaveLength(1);
  });

  it("filters by agency, matching partial names", () => {
    expect(filterPrograms(sample, { ...EMPTY_FILTERS, agency: "dswd" })).toHaveLength(1);
    expect(filterPrograms(sample, { ...EMPTY_FILTERS, agency: "SSS" })).toHaveLength(1);
  });

  it("filters by an individual compound category", () => {
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, category: "Education" }),
    ).toHaveLength(1);
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, category: "Health" }),
    ).toHaveLength(1);
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, category: "Pension" }),
    ).toHaveLength(1);
  });

  it("filters by target audience", () => {
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, audience: "Indigent" }),
    ).toHaveLength(1);
    expect(
      filterPrograms(sample, { ...EMPTY_FILTERS, audience: "Nobody" }),
    ).toHaveLength(0);
  });

  it("combines filters with AND semantics", () => {
    expect(
      filterPrograms(sample, {
        query: "cash",
        agency: "DSWD",
        category: "Education",
        audience: "Families",
      }),
    ).toHaveLength(1);
    expect(
      filterPrograms(sample, {
        query: "cash",
        agency: "SSS",
        category: "",
        audience: "",
      }),
    ).toHaveLength(0);
  });

  it("searches translated copy supplied by the localizer", () => {
    const result = filterPrograms(
      sample,
      { ...EMPTY_FILTERS, query: "libing" },
      (program) => ({
        name: program.id === "a" ? "Pantawid Pamilyang Pilipino (4Ps)" : "Benepisyo sa Pagreretiro",
        description: program.id === "b" ? "Tulong pang-libing para sa miyembro" : "",
      }),
    );
    expect(result.map((p) => p.id)).toEqual(["b"]);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterPrograms(sample, { ...EMPTY_FILTERS, query: "  aics  " })).toHaveLength(0);
    expect(filterPrograms(sample, { ...EMPTY_FILTERS, query: "  4ps  " })).toHaveLength(1);
  });

  it("produces a stable count for the full dataset", () => {
    expect(filterPrograms(programs, EMPTY_FILTERS)).toHaveLength(programs.length);
  });
});
