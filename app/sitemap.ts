import { programs } from "@/data/constants";
import { SITE_URL } from "@/lib/site";

interface StaticRoute {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/wizard", priority: 0.9, changeFrequency: "monthly" },
  { path: "/shortlist", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pathways", priority: 0.8, changeFrequency: "monthly" },
  { path: "/assistance", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hotlines", priority: 0.8, changeFrequency: "monthly" },
  { path: "/locator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/analytics", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/faqs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/sitemap", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...programs.map((program) => ({
      url: `${SITE_URL}/programs/${program.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
