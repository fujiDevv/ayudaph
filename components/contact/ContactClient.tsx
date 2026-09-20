"use client";

import {
  ArrowLeftIcon,
  BugIcon,
  CodeIcon,
  GlobeIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { useI18n } from "@/lib/i18n";
import { REPO_URL, SITE_URL } from "@/lib/site";

export default function ContactClient() {
  const { t } = useI18n();

  const channels = [
    {
      icon: BugIcon,
      title: t("contact.reportIssues"),
      desc: t("contact.reportIssuesDesc"),
      href: `${REPO_URL}/issues`,
      external: true,
    },
    {
      icon: CodeIcon,
      title: t("contact.sourceCode"),
      desc: t("contact.sourceCodeDesc"),
      href: REPO_URL,
      external: true,
    },
    {
      icon: GlobeIcon,
      title: t("contact.website"),
      desc: t("contact.websiteDesc"),
      href: SITE_URL,
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
        crumbs={[{ label: t("detail.contactUs") }]}
        icon={<MailIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.title}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <span className="inline-flex p-2.5 rounded-lg bg-primary-50 text-primary-600 mb-3">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-bold text-gray-900">{channel.title}</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {channel.desc}
                </p>
              </a>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("contact.backHome")}
          </Link>
        </div>
      </div>
    </>
  );
}
