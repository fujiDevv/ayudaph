import {
  Briefcase,
  Coins,
  GraduationCap,
  Heart,
  Home,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Tailwind classes for an agency pill, keyed off bettergov's theme tokens. */
export function getAgencyBadgeClasses(agency: string): string {
  const normalized = agency.toLowerCase();
  if (normalized.includes("dswd"))
    return "bg-secondary-50 text-secondary-700 border-secondary-200";
  if (normalized.includes("sss"))
    return "bg-primary-50 text-primary-700 border-primary-200";
  if (normalized.includes("philhealth"))
    return "bg-success-50 text-success-700 border-success-200";
  if (normalized.includes("pag-ibig") || normalized.includes("hdmf"))
    return "bg-accent-50 text-accent-700 border-accent-200";
  if (normalized.includes("gsis"))
    return "bg-teal-50 text-teal-700 border-teal-200";
  if (normalized.includes("dole"))
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (normalized.includes("doh"))
    return "bg-error-50 text-error-700 border-error-200";
  if (normalized.includes("owwa"))
    return "bg-violet-50 text-violet-700 border-violet-200";
  if (normalized.includes("ched") || normalized.includes("unifast"))
    return "bg-sky-50 text-sky-700 border-sky-200";
  if (normalized.includes("tesda"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

/** Pick a representative icon for a benefit category. */
export function getCategoryIcon(category: string): LucideIcon {
  const normalized = category.toLowerCase();
  if (normalized.includes("health") || normalized.includes("medical"))
    return Heart;
  if (
    normalized.includes("financial") ||
    normalized.includes("cash") ||
    normalized.includes("loan") ||
    normalized.includes("pension")
  )
    return Coins;
  if (
    normalized.includes("education") ||
    normalized.includes("scholarship") ||
    normalized.includes("student")
  )
    return GraduationCap;
  if (normalized.includes("housing") || normalized.includes("property"))
    return Home;
  if (
    normalized.includes("employment") ||
    normalized.includes("livelihood") ||
    normalized.includes("work")
  )
    return Briefcase;
  return Users;
}
