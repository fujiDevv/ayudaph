import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts the way bettergov.ph does. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Collapse a long program description into a SERP-friendly meta description.
 *
 * Search engines truncate around 160 characters, so anything longer is cut
 * mid-sentence and either dropped or rewritten. This trims on a word boundary
 * and drops trailing punctuation before appending an ellipsis.
 */
export function toMetaDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.replace(/[\s,;:.!?-]+$/, "")}\u2026`;
}
