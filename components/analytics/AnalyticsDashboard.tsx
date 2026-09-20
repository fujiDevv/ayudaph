"use client";

import {
  BarChart3Icon,
  EyeIcon,
  LandmarkIcon,
  SparklesIcon,
  TagIcon,
  UserCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { agencies, programs } from "@/data/constants";
import { getAgencyBadgeClasses } from "@/lib/agency";
import {
  buildAgencyData,
  buildAudienceData,
  buildCategoryData,
  buildDonutSlices,
  buildTagData,
} from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Program } from "@/lib/types";
import { cn } from "@/lib/utils";

type DrillType = "agency" | "category" | "audience" | "tag";
interface Drill {
  type: DrillType;
  value: string;
}

const AGENCY_BAR: Record<string, string> = {
  DSWD: "bg-orange-500",
  SSS: "bg-blue-600",
  PhilHealth: "bg-green-500",
  "Pag-IBIG": "bg-amber-500",
  GSIS: "bg-teal-500",
  DOLE: "bg-indigo-500",
  DOH: "bg-rose-500",
  OWWA: "bg-violet-500",
  CHED: "bg-sky-500",
  TESDA: "bg-amber-600",
  LGU: "bg-primary-500",
};

const DONUT_STROKE = [
  "stroke-amber-500",
  "stroke-blue-500",
  "stroke-purple-500",
  "stroke-indigo-500",
  "stroke-rose-500",
  "stroke-emerald-500",
  "stroke-teal-500",
  "stroke-gray-400",
];

const DONUT_FILL = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-gray-400",
];

function agencyBarClass(agency: string) {
  const key = Object.keys(AGENCY_BAR).find((name) =>
    agency.toLowerCase().includes(name.toLowerCase()),
  );
  return key ? AGENCY_BAR[key] : "bg-gray-500";
}

export default function AnalyticsDashboard() {
  const { t, locale } = useI18n();
  const { savedPrograms } = useStore();
  const [drill, setDrill] = useState<Drill | null>(null);

  const categoryLabel = (cat: string) => {
    if (locale !== "tl") return cat;
    const dict: Record<string, string> = {
      Financial: "Pinansyal",
      Education: "Edukasyon",
      Pension: "Pensyon",
      "Cash Allowance": "Allowance sa Cash",
      Burial: "Pagpapalibing",
      Medical: "Medikal",
      Healthcare: "Pangangalagang Pangkalusugan",
      Livelihood: "Kabuhayan",
      Loan: "Pautang",
      Retirement: "Pagreretiro",
      Family: "Pamilya",
      Seniors: "Senior Citizen",
      Sickness: "Pagkakasakit",
      Maternity: "Maternity",
      Newborn: "Bagong Silang",
      Housing: "Pabahay",
      Property: "Lupa",
      Scholarship: "Scholarship",
      Subsidy: "Subsidy",
      Preventive: "Pang-iwas na Lunas",
      "Medical Assistance": "Tulong Medikal",
      Others: "Iba pang Kategorya",
    };
    return dict[cat] ?? cat;
  };

  const audienceLabel = (aud: string) => {
    if (locale !== "tl") return aud;
    const dict: Record<string, string> = {
      Seniors: "Senior Citizen",
      Indigent: "Mahirap (Indigent)",
      "Low Income": "Mababang Kita",
      Retirees: "Retirado (Retirees)",
      "SSS Members": "Miyembro ng SSS",
      Students: "Mag-aaral",
      College: "Kolehiyo",
      "Solo Parents": "Solo Parents",
      Families: "Mga Pamilya",
      "Crisis Victims": "Biktima ng Krisis",
      Unemployed: "Walang Trabaho",
      "All Citizens": "Lahat ng Mamamayan",
      "PhilHealth Members": "Miyembro ng PhilHealth",
      Employed: "May Trabaho",
      "Pag-IBIG Members": "Miyembro ng Pag-IBIG",
      Mothers: "Mga Ina",
      Pregnant: "Buntis",
      Underemployed: "Kulang sa Trabaho",
      "Medical Patients": "Pasyenteng Medikal",
      "Self-Employed": "Nagtatrabaho sa Sarili",
      "Government Employees": "Empleyado ng Gobyerno",
      "OFW Dependents": "Dependent ng OFW",
      Newborns: "Bagong Silang",
      "Burial Claimants": "Nag-aapply sa Libing",
      OFWs: "Mga OFW",
    };
    return dict[aud] ?? aud;
  };

  const tagLabel = (tag: string) => {
    if (locale !== "tl") return tag;
    const dict: Record<string, string> = {
      pension: "pensyon",
      seniors: "seniors",
      financial: "pinansyal",
      retirement: "pagreretiro",
      education: "edukasyon",
      students: "mag-aaral",
      family: "pamilya",
      discounts: "diskuwento",
      crisis: "krisis",
      medical: "medikal",
      unemployed: "walang trabaho",
      preventive: "iwas-sakit",
      loans: "pautang",
      maternity: "maternity",
      livelihood: "kabuhayan",
      housing: "pabahay",
      newborn: "bagong silang",
      burial: "libing",
    };
    return dict[tag] ?? tag;
  };

  const categoryData = useMemo(() => buildCategoryData(programs), []);
  const agencyData = useMemo(() => buildAgencyData(programs), []);
  const audienceData = useMemo(() => buildAudienceData(programs), []);
  const tagData = useMemo(() => buildTagData(programs), []);

  const kpis = useMemo(() => {
    const totalRequirements = programs.reduce(
      (sum, p) => sum + p.requirements.length,
      0,
    );
    const totalSteps = programs.reduce((sum, p) => sum + p.steps.length, 0);
    return {
      programs: programs.length,
      agencies: agencies.length,
      categories: categoryData.length,
      avgRequirements: (totalRequirements / programs.length).toFixed(1),
      avgSteps: (totalSteps / programs.length).toFixed(1),
      bookmarks: savedPrograms.length,
    };
  }, [categoryData.length, savedPrograms.length]);

  const matched: Program[] = useMemo(() => {
    if (!drill) return [];
    if (drill.type === "agency")
      return programs.filter((p) => p.agency === drill.value);
    if (drill.type === "audience")
      return programs.filter((p) => p.target_audience.includes(drill.value));
    if (drill.type === "tag")
      return programs.filter((p) => p.tags.includes(drill.value));
    if (drill.value === "Others") {
      const topNames = categoryData.slice(0, 6).map((c) => c.name);
      return programs.filter((p) =>
        p.category
          .split(" / ")
          .map((c) => c.trim())
          .some((c) => !topNames.includes(c)),
      );
    }
    return programs.filter((p) =>
      p.category
        .split(" / ")
        .map((c) => c.trim())
        .includes(drill.value),
    );
  }, [drill, categoryData]);

  const toggle = (type: DrillType, value: string) =>
    setDrill((prev) =>
      prev && prev.type === type && prev.value === value ? null : { type, value },
    );

  // Donut geometry: top 6 categories plus an aggregated "Others" slice.
  const donut = useMemo(() => {
    const base = buildDonutSlices(categoryData);
    return {
      total: base.total,
      slices: base.slices.map((slice) => ({
        ...slice,
        stroke: DONUT_STROKE[slice.index % DONUT_STROKE.length],
        fill: DONUT_FILL[slice.index % DONUT_FILL.length],
      })),
    };
  }, [categoryData]);

  const maxAgency = Math.max(...agencyData.map((d) => d.count), 1);
  const maxAudience = Math.max(...audienceData.map((d) => d.count), 1);
  const maxTag = Math.max(...tagData.map((d) => d.count), 1);

  const kpiCards = [
    { key: "kpiTotalPrograms", value: kpis.programs, icon: BarChart3Icon },
    { key: "kpiAgencies", value: kpis.agencies, icon: LandmarkIcon },
    { key: "kpiCategories", value: kpis.categories, icon: TagIcon },
    { key: "kpiAvgRequirements", value: kpis.avgRequirements, icon: EyeIcon },
    { key: "kpiAvgSteps", value: kpis.avgSteps, icon: UserCheckIcon },
    { key: "kpiActiveBookmarks", value: kpis.bookmarks, icon: SparklesIcon },
  ];

  const takeaways = [
    { title: t("analytics.takeaway1Title"), desc: t("analytics.takeaway1Desc") },
    { title: t("analytics.takeaway2Title"), desc: t("analytics.takeaway2Desc") },
    { title: t("analytics.takeaway3Title"), desc: t("analytics.takeaway3Desc") },
  ];

  return (
    <>
      <PageHeader
        title={t("analytics.title")}
        subtitle={t("analytics.subtitle")}
        crumbs={[{ label: t("nav.analytics") }]}
        icon={<BarChart3Icon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="bg-white border border-gray-200 rounded-lg shadow-xs p-4"
              >
                <Icon className="h-4 w-4 text-primary-500 mb-2" />
                <div className="text-2xl font-extrabold text-gray-900">
                  {card.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-tight">
                  {t(`analytics.${card.key}`)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Executive summary */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t("analytics.executiveSummary")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {takeaways.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs"
              >
                <h3 className="font-bold text-primary-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agency bars */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {t("analytics.chartAgenciesTitle")}
            </h2>
            <div className="space-y-3">
              {agencyData.map((row) => {
                const active = drill?.type === "agency" && drill.value === row.name;
                return (
                  <button
                    key={row.name}
                    type="button"
                    onClick={() => toggle("agency", row.name)}
                    className={cn(
                      "w-full text-left rounded-md p-2 transition-colors",
                      active ? "bg-primary-50" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-semibold text-gray-700">
                        {row.name}
                      </span>
                      <span className="font-bold text-gray-900">{row.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", agencyBarClass(row.name))}
                        style={{ width: `${(row.count / maxAgency) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Category donut */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {t("analytics.chartCategoriesTitle")}
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <svg viewBox="0 0 200 200" className="w-44 h-44 -rotate-0">
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    className="stroke-gray-100"
                    strokeWidth="26"
                  />
                  {donut.slices.map((slice) => (
                    <circle
                      key={slice.name}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      strokeWidth="26"
                      className={cn(
                        slice.stroke,
                        "transition-opacity",
                        drill?.type === "category" &&
                          drill.value !== slice.name &&
                          "opacity-30",
                      )}
                      strokeDasharray={slice.circumference}
                      strokeDashoffset={slice.strokeDashoffset}
                      transform={`rotate(${slice.rotation} 100 100)`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggle("category", slice.name)}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {donut.total}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t("analytics.chartTooltipPrograms")}
                  </span>
                </div>
              </div>

              <ul className="flex-1 w-full space-y-2">
                {donut.slices.map((slice) => {
                  const active =
                    drill?.type === "category" && drill.value === slice.name;
                  return (
                    <li key={slice.name}>
                      <button
                        type="button"
                        onClick={() => toggle("category", slice.name)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
                          active ? "bg-primary-50" : "hover:bg-gray-50",
                        )}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "w-2.5 h-2.5 rounded-full shrink-0",
                              slice.fill,
                            )}
                          />
                          <span className="text-gray-700 truncate">
                            {categoryLabel(slice.name)}
                          </span>
                        </span>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          {slice.count} ({slice.percent}%)
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Audience bars */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {t("analytics.chartAudiencesTitle")}
            </h2>
            <div className="space-y-3">
              {audienceData.map((row) => {
                const active =
                  drill?.type === "audience" && drill.value === row.name;
                return (
                  <button
                    key={row.name}
                    type="button"
                    onClick={() => toggle("audience", row.name)}
                    className={cn(
                      "w-full text-left rounded-md p-2 transition-colors",
                      active ? "bg-primary-50" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">
                        {audienceLabel(row.name)}
                      </span>
                      <span className="font-bold text-gray-900">{row.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${(row.count / maxAudience) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tag bars */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {t("analytics.chartTagsTitle")}
            </h2>
            <div className="space-y-3">
              {tagData.map((row) => {
                const active = drill?.type === "tag" && drill.value === row.name;
                return (
                  <button
                    key={row.name}
                    type="button"
                    onClick={() => toggle("tag", row.name)}
                    className={cn(
                      "w-full text-left rounded-md p-2 transition-colors",
                      active ? "bg-accent-50" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700 capitalize">
                        {tagLabel(row.name)}
                      </span>
                      <span className="font-bold text-gray-900">{row.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent-500"
                        style={{ width: `${(row.count / maxTag) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Drill-down panel */}
        {drill && (
          <section className="bg-white border border-primary-200 rounded-lg shadow-xs p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900">
                {t("analytics.viewAll")} ({matched.length})
              </h2>
              <button
                type="button"
                onClick={() => setDrill(null)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
                Clear
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matched.map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="rounded-md border border-gray-200 p-4 hover:border-primary-300 hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border",
                      getAgencyBadgeClasses(program.agency),
                    )}
                  >
                    {program.agency}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-gray-900 leading-snug">
                    {t(`programs.${program.id}.name`) || program.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
