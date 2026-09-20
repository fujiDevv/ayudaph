"use client";

import { CheckCircle2, FolderOpen, Star } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { Card } from "@/components/ui/Card";
import { getAgencyBadgeClasses, getCategoryIcon } from "@/lib/agency";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { Program } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProgramCardProps {
  program: Program;
}

const ProgramCard: FC<ProgramCardProps> = ({ program }) => {
  const { t, tm } = useI18n();
  const { isSaved, toggleSaveProgram, getCheckedCount, getPreparedPercent } =
    useStore();

  const saved = isSaved(program.id);
  const checkedCount = getCheckedCount(program.id);
  const totalCount = program.requirements.length;
  const preparedPercent = getPreparedPercent(program);
  const CategoryIcon = getCategoryIcon(program.category);

  const name = t(`programs.${program.id}.name`) || program.name;
  const description = t(`programs.${program.id}.description`) || program.description;
  const steps = tm(`programs.${program.id}.steps`);
  const requirements = tm(`programs.${program.id}.requirements`);

  return (
    <Card hoverable className="flex flex-col h-full">
      <div className="flex flex-col h-full p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border",
                getAgencyBadgeClasses(program.agency),
              )}
            >
              {program.agency}
            </span>
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1">
              <CategoryIcon className="w-3.5 h-3.5 text-gray-500" />
              {program.category}
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleSaveProgram(program.id)}
            aria-pressed={saved}
            aria-label={`${saved ? t("card.removeBookmark") : t("card.bookmark")} ${name}`}
            title={saved ? t("card.removeBookmark") : t("card.bookmark")}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
          >
            <Star
              className={cn(
                "w-4 h-4",
                saved ? "text-accent-500 fill-current" : "text-gray-400",
              )}
            />
          </button>
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900 leading-snug">
          <Link href={`/programs/${program.id}`} className="hover:text-primary-600">
            {name}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="mt-3 flex items-center flex-wrap gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mr-1">
            For:
          </span>
          {program.target_audience.map((audience) => (
            <span
              key={audience}
              className="text-[10px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-md"
            >
              {audience}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5" /> {t("card.readiness")}
            </span>
            <span className="text-xs font-extrabold text-primary-600 flex items-center gap-1">
              {preparedPercent === 100 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />
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

        <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400 font-medium">
          <span>
            {steps.length} {t("card.steps")}
          </span>
          <span aria-hidden>•</span>
          <span>
            {requirements.length} {t("card.requirements")}
          </span>
          <span aria-hidden>•</span>
          <span>{program.processing_time}</span>
        </div>

        <Link
          href={`/programs/${program.id}`}
          className="mt-4 inline-flex items-center justify-center w-full rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary-600"
        >
          {t("detail.viewDetails")}
        </Link>
      </div>
    </Card>
  );
};

export default ProgramCard;
