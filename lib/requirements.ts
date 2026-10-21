import { programs } from "@/data/constants";
import en from "@/lib/i18n/en.json";
import tl from "@/lib/i18n/tl.json";
import { isRecord } from "./storage";

/** Collapse legacy translated labels into the dataset's permanent requirement IDs. */
export function migrateRequirements(value: unknown): Record<string, string[]> {
  if (!isRecord(value)) return {};
  const result: Record<string, string[]> = {};
  for (const program of programs) {
    const saved = value[program.id];
    if (!Array.isArray(saved)) continue;
    const english = en.programs[program.id as keyof typeof en.programs].requirements;
    const tagalog = tl.programs[program.id as keyof typeof tl.programs].requirements;
    const ids = program.requirement_ids.filter(
      (id, index) =>
        saved.includes(id) || saved.includes(program.requirements[index]) ||
        saved.includes(english[index]) || saved.includes(tagalog[index]),
    );
    if (ids.length) result[program.id] = ids;
  }
  return result;
}

export function normalizeSavedPrograms(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set(programs.map((program) => program.id));
  return [...new Set(value.filter(
    (id): id is string => typeof id === "string" && ids.has(id),
  ))];
}
