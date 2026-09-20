"use client";

import {
  Accessibility,
  AlertTriangle,
  ArrowLeftIcon,
  ArrowRightIcon,
  Baby,
  Ban,
  BookOpen,
  Briefcase,
  Building2,
  Coins,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Home,
  Hospital,
  Plane,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { programs } from "@/data/constants";
import { getAgencyBadgeClasses } from "@/lib/agency";
import { useI18n } from "@/lib/i18n";
import { recommendPrograms } from "@/lib/wizard";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  labelKey: string;
  icon: LucideIcon;
}

const statusOptions: Option[] = [
  { value: "Employed", labelKey: "finder.status.employed", icon: Briefcase },
  { value: "Government Employees", labelKey: "finder.status.gov", icon: Building2 },
  { value: "Unemployed", labelKey: "finder.status.unemployed", icon: Ban },
  { value: "Students", labelKey: "finder.status.student", icon: GraduationCap },
  { value: "Seniors", labelKey: "finder.status.senior", icon: User },
  { value: "OFW", labelKey: "finder.status.ofw", icon: Plane },
];

const needOptions: Option[] = [
  { value: "medical", labelKey: "finder.needs.medical", icon: Hospital },
  { value: "financial", labelKey: "finder.needs.financial", icon: Coins },
  { value: "housing", labelKey: "finder.needs.housing", icon: Home },
  { value: "education", labelKey: "finder.needs.education", icon: BookOpen },
];

const demographicOptions: Option[] = [
  { value: "Indigent", labelKey: "finder.demographics.indigent", icon: HeartHandshake },
  { value: "Crisis Victims", labelKey: "finder.demographics.crisis", icon: AlertTriangle },
  { value: "Pregnant", labelKey: "finder.demographics.pregnant", icon: Baby },
  { value: "PWD", labelKey: "finder.demographics.pwd", icon: Accessibility },
];

const TOTAL_STEPS = 3;

const AyudaFinder: FC = () => {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [need, setNeed] = useState("");
  const [demographics, setDemographics] = useState<string[]>([]);

  const toggleDemographic = (value: string) =>
    setDemographics((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

  const resetQuiz = () => {
    setStep(1);
    setStatus("");
    setNeed("");
    setDemographics([]);
  };

  const recommendedPrograms = useMemo(() => {
    if (step !== TOTAL_STEPS || !status || !need) return [];
    return recommendPrograms(programs, { status, need, demographics });
  }, [step, status, need, demographics]);

  const optionButton = (selected: boolean, onClick: () => void, opt: Option) => {
    const Icon = opt.icon;
    return (
      <button
        key={opt.value}
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={cn(
          "flex items-center gap-4 p-4 text-left rounded-lg border transition-all duration-200",
          selected
            ? "bg-primary-50 border-primary-500 text-primary-700 shadow-xs"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
        )}
      >
        <span className="p-2 bg-gray-50 border border-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </span>
        <span className="font-medium text-sm md:text-base">
          {t(opt.labelKey)}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xs uppercase font-medium tracking-wide text-gray-500">
            {t("finder.title")}
          </h2>
          <p className="text-xl font-bold text-gray-900 mt-0.5">
            {t("finder.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-600">
            {t("finder.step", { step, total: TOTAL_STEPS })}
          </span>
          <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-500 h-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="min-h-[280px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {t("finder.q1")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="group">
              {statusOptions.map((opt) =>
                optionButton(selectedIs(opt, status), () => {
                  setStatus(opt.value);
                  setStep(2);
                }, opt),
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {t("finder.q2")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="group">
              {needOptions.map((opt) =>
                optionButton(need === opt.value, () => {
                  setNeed(opt.value);
                  setStep(3);
                }, opt),
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {t("finder.q3")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" role="group">
              {demographicOptions.map((opt) =>
                optionButton(demographics.includes(opt.value), () =>
                  toggleDemographic(opt.value), opt),
              )}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-bold text-primary-700 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t("finder.recommendations")} ({recommendedPrograms.length})
              </h4>

              {recommendedPrograms.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <HelpCircle className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-gray-700 font-medium mt-2">
                    {t("finder.noMatchTitle")}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {t("finder.noMatchDesc")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                  {recommendedPrograms.map((program) => (
                    <div
                      key={program.id}
                      className="flex items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 hover:border-primary-300 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border",
                              getAgencyBadgeClasses(program.agency),
                            )}
                          >
                            {program.agency}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {program.category}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">
                          {t(`programs.${program.id}.name`) || program.name}
                        </h5>
                      </div>
                      <Link
                        href={`/programs/${program.id}`}
                        className="shrink-0 inline-flex items-center gap-1 rounded-md bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
                      >
                        {t("finder.viewDetails")}
                        <ArrowRightIcon className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 border-t border-gray-200 pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-primary-600"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t("finder.back")}
            </button>
          ) : (
            <div />
          )}

          {step === TOTAL_STEPS && (
            <button
              type="button"
              onClick={resetQuiz}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {t("finder.reset")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function selectedIs(opt: Option, value: string) {
  return opt.value === value;
}

export default AyudaFinder;
