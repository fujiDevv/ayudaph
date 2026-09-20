"use client";

import { MapIcon } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { useI18n } from "@/lib/i18n";

interface SitemapLink {
  label: string;
  href: string;
  description: string;
}

export default function SitemapClient() {
  const { t } = useI18n();

  const groups: { title: string; description: string; links: SitemapLink[] }[] = [
    {
      title: t("sitemap.coreTools"),
      description: t("sitemap.coreToolsDesc"),
      links: [
        { label: t("nav.directory"), href: "/", description: t("hero.desc") },
        { label: t("nav.quiz"), href: "/wizard", description: t("wizard.desc") },
        {
          label: t("nav.saved"),
          href: "/shortlist",
          description: t("shortlist.desc"),
        },
        {
          label: t("nav.assistance"),
          href: "/assistance",
          description: t("assistance.desc"),
        },
      ],
    },
    {
      title: t("sitemap.resources"),
      description: t("sitemap.resourcesDesc"),
      links: [
        {
          label: t("nav.hotlines"),
          href: "/hotlines",
          description: t("hotlines.desc"),
        },
        {
          label: t("nav.locator"),
          href: "/locator",
          description: t("locator.desc"),
        },
        {
          label: t("nav.pathways"),
          href: "/pathways",
          description: t("pathways.desc"),
        },
        {
          label: t("nav.analytics"),
          href: "/analytics",
          description: t("analytics.subtitle"),
        },
      ],
    },
    {
      title: t("sitemap.meta"),
      description: t("sitemap.metaDesc"),
      links: [
        { label: t("nav.about"), href: "/about", description: t("about.subtitle") },
        { label: t("nav.faqs"), href: "/faqs", description: t("faqs.subtitle") },
        {
          label: t("detail.contactUs"),
          href: "/contact",
          description: t("contact.subtitle"),
        },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title={t("sitemap.title")}
        subtitle={t("sitemap.subtitle")}
        crumbs={[{ label: t("nav.sitemap") }]}
        icon={<MapIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10 space-y-10">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-xl font-bold text-gray-900">{group.title}</h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              {group.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white border border-gray-200 rounded-lg shadow-xs p-5 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <span className="font-semibold text-primary-600">
                    {link.label}
                  </span>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
