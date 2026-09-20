"use client";

import { WandSparkles } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AyudaFinder from "./AyudaFinder";
import { useI18n } from "@/lib/i18n";

export default function WizardClient() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t("wizard.title")}
        subtitle={t("wizard.desc")}
        crumbs={[{ label: t("nav.quiz") }]}
        icon={<WandSparkles className="h-6 w-6" />}
      />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <AyudaFinder />
      </div>
    </>
  );
}
