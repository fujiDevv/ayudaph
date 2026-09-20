import type { Program } from "./types";

export interface DirectoryFilters {
  query: string;
  agency: string;
  category: string;
  audience: string;
}

export const EMPTY_FILTERS: DirectoryFilters = {
  query: "",
  agency: "",
  category: "",
  audience: "",
};

/** Compound categories are stored as "Financial / Education / Health". */
export function splitCategory(category: string): string[] {
  return category
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function hasActiveFilters(filters: DirectoryFilters): boolean {
  return Boolean(
    filters.query || filters.agency || filters.category || filters.audience,
  );
}

/**
 * Filter the benefits directory.
 *
 * `localize` supplies the translated name/description so keyword search works
 * against whichever language the visitor selected.
 */
export function filterPrograms(
  programs: Program[],
  filters: DirectoryFilters,
  localize: (program: Program) => { name: string; description: string } = (
    program,
  ) => ({ name: program.name, description: program.description }),
): Program[] {
  const needle = filters.query.trim().toLowerCase();
  const agency = filters.agency.toLowerCase();

  return programs.filter((program) => {
    if (needle.length > 0) {
      const { name, description } = localize(program);
      const haystack = [
        name,
        description,
        program.agency,
        program.category,
        ...program.tags,
        ...program.target_audience,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    if (agency.length > 0 && !program.agency.toLowerCase().includes(agency)) {
      return false;
    }

    if (
      filters.category.length > 0 &&
      !splitCategory(program.category).includes(filters.category)
    ) {
      return false;
    }

    if (
      filters.audience.length > 0 &&
      !program.target_audience.includes(filters.audience)
    ) {
      return false;
    }

    return true;
  });
}
