"use client";

import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import { FC, useMemo, useRef, useState } from "react";
import {
  activeAudienceTags,
  agencies,
  categories,
  programs,
} from "@/data/constants";
import { filterPrograms, hasActiveFilters } from "@/lib/filtering";
import { useI18n } from "@/lib/i18n";
import ProgramCard from "./ProgramCard";
import Hero from "@/components/home/Hero";

interface DirectoryClientProps {
  showHero?: boolean;
}

const DirectoryClient: FC<DirectoryClientProps> = ({ showHero = true }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [agency, setAgency] = useState("");
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const directoryRef = useRef<HTMLDivElement>(null);

  const filters = useMemo(
    () => ({ query, agency, category, audience }),
    [query, agency, category, audience],
  );

  const filtered = useMemo(
    () =>
      filterPrograms(programs, filters, (program) => ({
        name: t(`programs.${program.id}.name`) || program.name,
        description:
          t(`programs.${program.id}.description`) || program.description,
      })),
    [filters, t],
  );

  const hasFilters = hasActiveFilters(filters);

  const clearAll = () => {
    setQuery("");
    setAgency("");
    setCategory("");
    setAudience("");
  };

  const quickFilter = (nextAgency: string) => {
    setAgency(nextAgency);
    directoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500";

  return (
    <>
      {showHero && (
        <Hero value={query} onChange={setQuery} onQuickFilter={quickFilter} />
      )}

      <section
        id="directory"
        ref={directoryRef}
        className="container mx-auto px-4 py-10 scroll-mt-24"
      >
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("nav.directory")}
          </h2>
          <p className="text-gray-600">{t("hero.desc")}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 md:p-5">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="relative flex-1">
              <label
                htmlFor="directory-search"
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1"
              >
                {t("filters.search")}
              </label>
              <SearchIcon className="pointer-events-none absolute left-3 bottom-2.5 h-4 w-4 text-gray-400" />
              <input
                id="directory-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("filters.searchPlaceholder")}
                className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
            >
              <FilterIcon className="h-4 w-4" />
              {t("filters.title")}
            </button>

            <div
              className={`${showFilters ? "grid" : "hidden"} lg:grid grid-cols-1 sm:grid-cols-3 gap-4 lg:flex-1`}
            >
              <div>
                <label
                  htmlFor="filter-agency"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1"
                >
                  {t("filters.agency")}
                </label>
                <select
                  id="filter-agency"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("locator.allAgencies")}</option>
                  {agencies.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-category"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1"
                >
                  {t("filters.category")}
                </label>
                <select
                  id="filter-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("filters.category")}</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-audience"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1"
                >
                  {t("filters.audience")}
                </label>
                <select
                  id="filter-audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("filters.audience")}</option>
                  {activeAudienceTags.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              >
                <XIcon className="h-4 w-4" />
                {t("filters.clearAll")}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          {t("feed.showing", {
            count: filtered.length,
            total: programs.length,
          })}
        </p>

        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-10 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              {t("feed.noMatches")}
            </h3>
            <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
              {t("feed.noMatchesDesc")}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
            >
              {t("feed.resetFilters")}
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default DirectoryClient;
