export interface NavChild {
  /** i18n key resolved against the `nav.*` namespace. */
  labelKey: string;
  href: string;
}

export interface NavItem {
  /** i18n key resolved against the `navbar.*` namespace (group label). */
  groupKey: string;
  href: string;
  children?: NavChild[];
}

export const mainNavigation: NavItem[] = [
  {
    groupKey: "benefits",
    href: "/",
    children: [
      { labelKey: "directory", href: "/" },
      { labelKey: "quiz", href: "/wizard" },
      { labelKey: "pathways", href: "/pathways" },
      { labelKey: "saved", href: "/shortlist" },
    ],
  },
  {
    groupKey: "support",
    href: "/hotlines",
    children: [
      { labelKey: "hotlines", href: "/hotlines" },
      { labelKey: "locator", href: "/locator" },
      { labelKey: "assistance", href: "/assistance" },
    ],
  },
  {
    groupKey: "insights",
    href: "/analytics",
    children: [
      { labelKey: "analytics", href: "/analytics" },
      { labelKey: "faqs", href: "/faqs" },
      { labelKey: "sitemap", href: "/sitemap" },
    ],
  },
  {
    groupKey: "about",
    href: "/about",
  },
];

export interface FooterSection {
  titleKey: string;
  links: NavChild[];
}

export const footerSections: FooterSection[] = [
  {
    titleKey: "benefits",
    links: [
      { labelKey: "directory", href: "/" },
      { labelKey: "quiz", href: "/wizard" },
      { labelKey: "pathways", href: "/pathways" },
      { labelKey: "saved", href: "/shortlist" },
    ],
  },
  {
    titleKey: "support",
    links: [
      { labelKey: "hotlines", href: "/hotlines" },
      { labelKey: "locator", href: "/locator" },
      { labelKey: "assistance", href: "/assistance" },
    ],
  },
  {
    titleKey: "insights",
    links: [
      { labelKey: "analytics", href: "/analytics" },
      { labelKey: "faqs", href: "/faqs" },
      { labelKey: "sitemap", href: "/sitemap" },
      { labelKey: "about", href: "/about" },
    ],
  },
];
