"use client";

import { StarIcon } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ProgramCard from "@/components/directory/ProgramCard";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function ShortlistClient() {
  const { t } = useI18n();
  const { shortlistedPrograms } = useStore();

  return (
    <>
      <PageHeader
        title={t("shortlist.title")}
        subtitle={t("shortlist.desc")}
        crumbs={[{ label: t("nav.saved") }]}
        icon={<StarIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10">
        {shortlistedPrograms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <StarIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900 mt-4">
              {t("shortlist.noBookmarks")}
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto px-4">
              {t("shortlist.noBookmarksDesc")}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
            >
              {t("shortlist.browse")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
