"use client";

import { ChevronDownIcon, HelpCircleIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { FAQ_ITEMS } from "@/lib/faqs";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "catAll",
  "catGeneral",
  "catPrivacy",
  "catData",
  "catContrib",
] as const;

export default function FaqsClient() {
  const { t } = useI18n();
  const [category, setCategory] = useState<string>("catAll");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("1");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        category === "catAll" || item.category === category;
      if (!matchesCategory) return false;
      if (!needle) return true;
      const question = t(`faqs.q${item.id}`).toLowerCase();
      const answer = t(`faqs.a${item.id}`).toLowerCase();
      return question.includes(needle) || answer.includes(needle);
    });
  }, [category, query, t]);

  return (
    <>
      <PageHeader
        title={t("faqs.title")}
        subtitle={t("faqs.subtitle")}
        crumbs={[{ label: t("nav.faqs") }]}
        icon={<HelpCircleIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="relative mb-6">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("faqs.searchPlaceholder")}
            aria-label={t("faqs.searchPlaceholder")}
            className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === cat
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
              )}
            >
              {t(`faqs.${cat}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{t("faqs.noResults")}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      {t(`faqs.q${item.id}`)}
                    </span>
                    <ChevronDownIcon
                      className={cn(
                        "h-5 w-5 shrink-0 text-gray-400 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                      {t(`faqs.a${item.id}`)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
