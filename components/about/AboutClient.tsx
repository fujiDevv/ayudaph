"use client";

import {
  EyeIcon,
  HeartHandshakeIcon,
  InfoIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useI18n } from "@/lib/i18n";
import { REPO_URL } from "@/lib/site";

export default function AboutClient() {
  const { t } = useI18n();

  const values = [
    {
      icon: EyeIcon,
      title: t("about.values.transparency"),
      desc: t("about.values.transparencyDesc"),
    },
    {
      icon: ShieldCheckIcon,
      title: t("about.values.privacy"),
      desc: t("about.values.privacyDesc"),
    },
    {
      icon: HeartHandshakeIcon,
      title: t("about.values.accessibility"),
      desc: t("about.values.accessibilityDesc"),
    },
  ];

  return (
    <>
      <PageHeader
        title={t("about.title")}
        subtitle={t("about.subtitle")}
        crumbs={[{ label: t("nav.about") }]}
        icon={<InfoIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {t("about.missionTitle")}
          </h2>
          <p className="text-gray-600 leading-relaxed">{t("about.missionDesc")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t("about.valuesTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-gray-200 rounded-lg shadow-xs p-6"
                >
                  <span className="inline-flex p-2.5 rounded-lg bg-primary-50 text-primary-600 mb-3">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-bold text-gray-900">{value.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-accent-500" />
            {t("about.initiativeTitle")}
          </h2>
          <p
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t("about.initiativeDesc") }}
          />
        </section>

        <section className="bg-gray-900 text-white rounded-lg p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">{t("about.openSourceTitle")}</h2>
            <p className="mt-1 text-sm text-gray-300">{t("about.openSourceDesc")}</p>
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 whitespace-nowrap"
          >
            {t("about.contribButton")}
          </a>
        </section>
      </div>
    </>
  );
}
