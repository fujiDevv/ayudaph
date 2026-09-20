"use client";

import {
  ArrowLeftIcon,
  Baby,
  Briefcase,
  CheckCircle2,
  ChevronRightIcon,
  ExternalLinkIcon,
  GraduationCap,
  Heart,
  HeartHandshake,
  InfoIcon,
  LayersIcon,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { programs } from "@/data/constants";
import { pathways, type PathwayKey } from "@/data/pathways";
import { getAgencyBadgeClasses } from "@/lib/agency";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PATHWAY_ICONS: Record<string, LucideIcon> = {
  Baby,
  Heart,
  Briefcase,
  HeartHandshake,
  GraduationCap,
  Users,
};

const PROGRESS_KEY = "ayuda_pathways_progress";

export default function PathwaysClient() {
  const { t, tm } = useI18n();
  const [selected, setSelected] = useState<PathwayKey | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_KEY);
      if (raw) setCheckedItems(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      setCheckedItems({});
    }
  }, []);

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const activePathway = useMemo(
    () => pathways.find((p) => p.key === selected) ?? null,
    [selected],
  );

  /** Resolve a bundled item to its display copy and checklist. */
  const resolveItem = (pathwayKey: PathwayKey, index: number) => {
    const item = pathways.find((p) => p.key === pathwayKey)!.items[index];
    if (item.programId) {
      const program = programs.find((p) => p.id === item.programId);
      const localizedName = t(`programs.${item.programId}.name`);
      const requirements = tm(`programs.${item.programId}.requirements`);
      const steps = tm(`programs.${item.programId}.steps`);
      return {
        programId: item.programId,
        agency: item.agency,
        purpose: item.purpose,
        name: localizedName || program?.name || "",
        requirements:
          requirements.length > 0 ? requirements : (program?.requirements ?? []),
        steps: steps.length > 0 ? steps : (program?.steps ?? []),
      };
    }
    return {
      programId: undefined,
      agency: item.agency,
      purpose: item.purpose,
      name: item.name ?? "",
      requirements: item.requirements ?? [],
      steps: item.steps ?? [],
    };
  };

  const progress = useMemo(() => {
    if (!activePathway) return { total: 0, checked: 0, percentage: 0 };
    let total = 0;
    let checked = 0;
    activePathway.items.forEach((_, itemIdx) => {
      const item = resolveItem(activePathway.key, itemIdx);
      item.requirements.forEach((__, reqIdx) => {
        total++;
        if (checkedItems[`${activePathway.key}_item_${itemIdx}_req_${reqIdx}`])
          checked++;
      });
      item.steps.forEach((__, stepIdx) => {
        total++;
        if (checkedItems[`${activePathway.key}_item_${itemIdx}_step_${stepIdx}`])
          checked++;
      });
    });
    return {
      total,
      checked,
      percentage: total === 0 ? 0 : Math.round((checked / total) * 100),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePathway, checkedItems, t]);

  return (
    <>
      <PageHeader
        title={t("pathways.title")}
        subtitle={t("pathways.desc")}
        crumbs={[{ label: t("nav.pathways") }]}
        icon={<LayersIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10">
        {!selected || !activePathway ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathways.map((pathway) => {
              const Icon = PATHWAY_ICONS[pathway.icon] ?? LayersIcon;
              return (
                <button
                  key={pathway.key}
                  type="button"
                  onClick={() => setSelected(pathway.key)}
                  className="group text-left bg-white border border-gray-200 rounded-lg shadow-xs p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <span
                      className={cn(
                        "inline-flex p-3 rounded-lg border",
                        pathway.accent,
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {t(pathway.titleKey)}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {t(pathway.descKey)}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-primary-600 transition-colors">
                    <span>
                      {pathway.items.length} programs / checklists
                    </span>
                    <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t("pathways.selectEvent")}
            </button>

            <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "p-2.5 rounded-lg border",
                      activePathway.accent,
                    )}
                  >
                    {(() => {
                      const Icon = PATHWAY_ICONS[activePathway.icon] ?? LayersIcon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Life-Event Bundle
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {t(activePathway.titleKey)}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(activePathway.descKey)}
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 w-full md:w-56 shrink-0 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>{t("pathways.progress")}</span>
                  <span className="text-gray-900">
                    {progress.checked} / {progress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-500 h-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] font-bold text-primary-600 uppercase tracking-wider text-right">
                  {progress.percentage}% Completed
                </div>
              </div>
            </div>

            <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
              <h3 className="text-base font-bold text-accent-800 flex items-center gap-2">
                <InfoIcon className="w-5 h-5 shrink-0" />
                {t("pathways.coordinationTips")}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-accent-900/80 leading-relaxed">
                {t(activePathway.tipsKey)
                  .split(". ")
                  .filter((tip) => tip.trim().length > 0)
                  .map((tip, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span aria-hidden>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {t("pathways.bundleIncludes")}
              </h3>

              {activePathway.items.map((_, itemIdx) => {
                const item = resolveItem(activePathway.key, itemIdx);
                return (
                  <div
                    key={itemIdx}
                    className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 md:p-8 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="space-y-1">
                        <span
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border",
                            getAgencyBadgeClasses(item.agency),
                          )}
                        >
                          {item.agency}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900 mt-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {item.purpose}
                        </p>
                      </div>

                      {item.programId && (
                        <Link
                          href={`/programs/${item.programId}`}
                          className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700"
                        >
                          <span>{t("finder.viewDetails")}</span>
                          <ExternalLinkIcon className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {t("card.requirements")}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.requirements.map((requirement, reqIdx) => {
                          const key = `${activePathway.key}_item_${itemIdx}_req_${reqIdx}`;
                          const isChecked = !!checkedItems[key];
                          return (
                            <label
                              key={reqIdx}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none",
                                isChecked
                                  ? "bg-primary-50/40 border-primary-200"
                                  : "bg-gray-50/60 border-gray-200 hover:bg-gray-100/60",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleItem(key)}
                                className="w-4 h-4 rounded border-gray-300 accent-primary-500 mt-0.5"
                              />
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  isChecked
                                    ? "text-gray-400 line-through"
                                    : "text-gray-700",
                                )}
                              >
                                {requirement}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {t("card.steps")}
                      </h5>
                      <div className="space-y-2.5">
                        {item.steps.map((step, stepIdx) => {
                          const key = `${activePathway.key}_item_${itemIdx}_step_${stepIdx}`;
                          const isChecked = !!checkedItems[key];
                          return (
                            <button
                              key={stepIdx}
                              type="button"
                              onClick={() => toggleItem(key)}
                              className={cn(
                                "w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-colors select-none",
                                isChecked
                                  ? "bg-primary-50/40 border-primary-200"
                                  : "bg-gray-50/60 border-gray-200 hover:bg-gray-100/60",
                              )}
                            >
                              <CheckCircle2
                                className={cn(
                                  "w-4 h-4 mt-0.5 shrink-0",
                                  isChecked
                                    ? "text-success-500"
                                    : "text-gray-300",
                                )}
                              />
                              <span className="space-y-0.5">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  Step {stepIdx + 1}
                                </span>
                                <span
                                  className={cn(
                                    "block text-xs font-medium leading-relaxed",
                                    isChecked
                                      ? "text-gray-400 line-through"
                                      : "text-gray-700",
                                  )}
                                >
                                  {step}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
