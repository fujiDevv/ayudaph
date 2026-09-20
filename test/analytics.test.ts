import { describe, expect, it } from "vitest";
import { programs } from "@/data/constants";
import {
  buildAgencyData,
  buildAudienceData,
  buildCategoryData,
  buildDonutSlices,
  buildTagData,
  countsOf,
} from "@/lib/analytics";
import type { Program } from "@/lib/types";

const sample: Program[] = [
  {
    id: "a",
    agency: "DSWD",
    name: "A",
    category: "Financial / Health",
    description: "",
    target_audience: ["Indigent", "Families"],
    processing_time: "",
    official_url: "",
    steps: [],
    requirements: [],
    tags: ["financial", "medical"],
  },
  {
    id: "b",
    agency: "DSWD",
    name: "B",
    category: "Financial",
    description: "",
    target_audience: ["Indigent"],
    processing_time: "",
    official_url: "",
    steps: [],
    requirements: [],
    tags: ["financial"],
  },
];

describe("countsOf", () => {
  it("tallies repeated values", () => {
    expect(countsOf(["x", "x", "y"])).toEqual([
      { name: "x", count: 2 },
      { name: "y", count: 1 },
    ]);
  });

  it("sorts by count descending, then alphabetically", () => {
    expect(countsOf(["b", "a", "c", "c"])).toEqual([
      { name: "c", count: 2 },
      { name: "a", count: 1 },
      { name: "b", count: 1 },
    ]);
  });

  it("handles an empty list", () => {
    expect(countsOf([])).toEqual([]);
  });
});

describe("buildCategoryData", () => {
  it("counts each compound category separately", () => {
    expect(buildCategoryData(sample)).toEqual([
      { name: "Financial", count: 2 },
      { name: "Health", count: 1 },
    ]);
  });
});

describe("buildAgencyData", () => {
  it("groups programs by agency", () => {
    expect(buildAgencyData(sample)).toEqual([{ name: "DSWD", count: 2 }]);
  });
});

describe("buildAudienceData / buildTagData", () => {
  it("counts audiences and respects the limit", () => {
    expect(buildAudienceData(sample)).toEqual([
      { name: "Indigent", count: 2 },
      { name: "Families", count: 1 },
    ]);
    expect(buildAudienceData(programs, 3)).toHaveLength(3);
  });

  it("counts tags and caps at fifteen by default", () => {
    expect(buildTagData(sample)).toEqual([
      { name: "financial", count: 2 },
      { name: "medical", count: 1 },
    ]);
    expect(buildTagData(programs).length).toBeLessThanOrEqual(15);
  });
});

describe("buildDonutSlices", () => {
  it("computes percentages that sum to roughly 100", () => {
    const { total, slices } = buildDonutSlices(buildCategoryData(programs));
    expect(total).toBeGreaterThan(0);
    const sum = slices.reduce((acc, slice) => acc + slice.percent, 0);
    expect(sum).toBeGreaterThanOrEqual(98);
    expect(sum).toBeLessThanOrEqual(102);
  });

  it("folds the long tail into a single Others slice", () => {
    const categories = Array.from({ length: 10 }, (_, i) => ({
      name: `Cat${i}`,
      count: 10 - i,
    }));
    const { slices } = buildDonutSlices(categories);
    expect(slices).toHaveLength(7);
    expect(slices[6].name).toBe("Others");
    // Others should aggregate categories 6..9 => 4 + 3 + 2 + 1
    expect(slices[6].count).toBe(10);
  });

  it("keeps every category when there are seven or fewer", () => {
    const categories = Array.from({ length: 7 }, (_, i) => ({
      name: `Cat${i}`,
      count: 1,
    }));
    expect(buildDonutSlices(categories).slices).toHaveLength(7);
  });

  it("starts the first slice at -90 degrees and advances by its share", () => {
    const { slices } = buildDonutSlices(
      [
        { name: "Half", count: 1 },
        { name: "Half", count: 1 },
      ],
      70,
      6,
    );
    expect(slices[0].rotation).toBe(-90);
    expect(slices[1].rotation).toBeCloseTo(90, 5);
    expect(slices[0].strokeDashoffset).toBeCloseTo(slices[0].circumference / 2, 5);
  });

  it("does not divide by zero on an empty dataset", () => {
    const { total, slices } = buildDonutSlices([]);
    expect(total).toBe(0);
    expect(slices).toEqual([]);
  });
});
