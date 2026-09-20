import { splitCategory } from "./filtering";
import type { Program } from "./types";

export interface Counted {
  name: string;
  count: number;
}

/** Tally occurrences of each label, sorted by count then alphabetically. */
export function countsOf(items: string[]): Counted[] {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function buildAgencyData(programs: Program[]): Counted[] {
  return countsOf(programs.map((program) => program.agency));
}

export function buildCategoryData(programs: Program[]): Counted[] {
  return countsOf(
    programs.flatMap((program) => splitCategory(program.category)),
  );
}

export function buildAudienceData(programs: Program[], limit = 15): Counted[] {
  return countsOf(
    programs.flatMap((program) => program.target_audience),
  ).slice(0, limit);
}

export function buildTagData(programs: Program[], limit = 15): Counted[] {
  return countsOf(programs.flatMap((program) => program.tags)).slice(0, limit);
}

export interface DonutSlice {
  name: string;
  count: number;
  percent: number;
  circumference: number;
  strokeDashoffset: number;
  rotation: number;
  index: number;
}

/**
 * Fold the long tail of categories into "Others" and compute the geometry for
 * an SVG donut of radius `radius`.
 */
export function buildDonutSlices(
  categories: Counted[],
  radius = 70,
  maxSlices = 6,
): { total: number; slices: DonutSlice[] } {
  const slices =
    categories.length <= maxSlices + 1
      ? categories
      : [
          ...categories.slice(0, maxSlices),
          {
            name: "Others",
            count: categories
              .slice(maxSlices)
              .reduce((sum, item) => sum + item.count, 0),
          },
        ];

  const total = slices.reduce((sum, item) => sum + item.count, 0);
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return {
    total,
    slices: slices.map((item, index) => {
      const fraction = total === 0 ? 0 : item.count / total;
      const rotation = accumulated * 360 - 90;
      accumulated += fraction;
      return {
        name: item.name,
        count: item.count,
        percent: Math.round(fraction * 100),
        circumference,
        strokeDashoffset: circumference * (1 - fraction),
        rotation,
        index,
      };
    }),
  };
}
