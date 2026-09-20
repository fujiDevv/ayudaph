"use client";

import {
  ArrowLeftIcon,
  CheckCircle2,
  ClockIcon,
  ExternalLinkIcon,
  PrinterIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";
import { programs } from "@/data/constants";
import { getAgencyBadgeClasses, getCategoryIcon } from "@/lib/agency";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ProgramDetailProps {
  programId: string;
}

const ProgramDetail: FC<ProgramDetailProps> = ({ programId }) => {
  const { t, tm } = useI18n();
  const {
    isSaved,
    toggleSaveProgram,
    isRequirementChecked,
    toggleRequirement,
    getCheckedCount,
    getPreparedPercent,
  } = useStore();
  const [copied, setCopied] = useState(false);

  const program = programs.find((item) => item.id === programId);

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("detail.notFoundTitle")}
        </h1>
        <p className="mt-3 text-gray-600">{t("detail.notFoundDesc")}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          {t("detail.returnHome")}
        </Link>
      </div>
    );
  }

  const name = t(`programs.${program.id}.name`) || program.name;
  const description = t(`programs.${program.id}.description`) || program.description;
  const steps = tm(`programs.${program.id}.steps`);
  const requirements = tm(`programs.${program.id}.requirements`);

  const saved = isSaved(program.id);
  const checkedCount = getCheckedCount(program.id);
  const totalCount = requirements.length;
  const preparedPercent = getPreparedPercent(program);
  const CategoryIcon = getCategoryIcon(program.category);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="container mx-auto px-4 py-8 md:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {t("detail.backToDir")}
      </Link>

      <header className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider border",
                getAgencyBadgeClasses(program.agency),
              )}
            >
              {program.agency}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1">
              <CategoryIcon className="w-3.5 h-3.5 text-gray-500" />
              {program.category}
            </span>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => toggleSaveProgram(program.id)}
              aria-pressed={saved}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                saved
                  ? "border-accent-300 bg-accent-50 text-accent-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50",
              )}
            >
              <StarIcon
                className={cn("h-4 w-4", saved && "fill-current text-accent-500")}
              />
              {saved ? t("card.removeBookmark") : t("card.bookmark")}
            </button>
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Share2Icon className="h-4 w-4" />
              {copied ? t("detail.linkCopied") : t("detail.share")}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4" />
              {t("detail.print")}
            </button>
          </div>
        </div>

        <h1 className="mt-5 text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {name}
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{t("detail.processingTime")}:</span>
            <span>{program.processing_time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">{t("filters.audience")}:</span>
            <span>{program.target_audience.join(", ")}</span>
          </div>
        </div>

        {program.official_url && (
          <a
            href={program.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 print:hidden"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            {t("detail.visitWebsite")}
          </a>
        )}
      </header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-xs p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {t("card.requirements")}
          </h2>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                {t("detail.prepared")}
              </span>
              <span className="text-sm font-extrabold text-primary-600 flex items-center gap-1">
                {preparedPercent === 100 && (
                  <CheckCircle2 className="h-4 w-4 text-success-500" />
                )}
                {checkedCount} / {totalCount} ({preparedPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  preparedPercent === 100 ? "bg-success-500" : "bg-primary-500",
                )}
                style={{ width: `${preparedPercent}%` }}
              />
            </div>
          </div>

          <ul className="space-y-2">
            {requirements.map((requirement) => {
              const checked = isRequirementChecked(program.id, requirement);
              return (
                <li key={requirement}>
                  <label
                    className={cn(
                      "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                      checked
                        ? "border-success-200 bg-success-50"
                        : "border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleRequirement(program.id, requirement)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary-500"
                    />
                    <span
                      className={cn(
                        "text-sm leading-relaxed",
                        checked
                          ? "text-success-800 line-through"
                          : "text-gray-700",
                      )}
                    >
                      {requirement}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {t("card.steps")}
          </h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};

export default ProgramDetail;
