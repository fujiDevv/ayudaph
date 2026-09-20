"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { programs } from "@/data/constants";
import { useI18n } from "@/lib/i18n";

interface HeroProps {
  value: string;
  onChange: (value: string) => void;
  onQuickFilter: (agency: string) => void;
}

const quickAccess = [
  { agency: "DSWD", label: "DSWD", hint: "AICS, 4Ps, Pension" },
  { agency: "SSS", label: "SSS", hint: "Retirement, Sickness" },
  { agency: "PhilHealth", label: "PhilHealth", hint: "YAKAP, Newborn" },
  { agency: "Pag-IBIG", label: "Pag-IBIG", hint: "Housing, MPL" },
];

const Hero: FC<HeroProps> = ({ value, onChange, onQuickFilter }) => {
  const { t } = useI18n();

  const findCount = (agency: string) =>
    programs.filter((p) => p.agency.toLowerCase().includes(agency.toLowerCase()))
      .length;

  return (
    <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold mb-4">
              {t("header.subtitle")}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-lg">
              {t("hero.desc")}
            </p>

            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="relative mb-6"
            >
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("filters.searchPlaceholder")}
                aria-label={t("filters.search")}
                className="w-full rounded-xl border border-transparent bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 shadow-lg focus:outline-hidden focus:ring-2 focus:ring-accent-400"
              />
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/wizard"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 py-2 px-4 rounded-xl text-sm transition-colors"
              >
                {t("nav.quiz")}
              </Link>
              <Link
                href="/pathways"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 py-2 px-4 rounded-xl text-sm transition-colors"
              >
                {t("nav.pathways")}
              </Link>
              <Link
                href="/assistance"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 py-2 px-4 rounded-xl text-sm transition-colors"
              >
                {t("nav.assistance")}
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-6 shadow-lg animate-slide-in">
            <h2 className="text-2xl font-semibold mb-4">{t("filters.agency")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickAccess.map((item) => (
                <button
                  key={item.agency}
                  type="button"
                  onClick={() => onQuickFilter(item.agency)}
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
                >
                  <span className="text-2xl font-bold">{item.label}</span>
                  <span className="text-xs text-primary-100 mt-1">
                    {findCount(item.agency)} programs
                  </span>
                  <span className="text-[11px] text-primary-200 mt-0.5">
                    {item.hint}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex">
              <button
                type="button"
                onClick={() => onQuickFilter("")}
                className="bg-white/10 text-white hover:bg-white/20 transition-all duration-300 w-full rounded-lg p-4 text-center cursor-pointer"
              >
                {t("navbar.browseAll")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
