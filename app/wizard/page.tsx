import type { Metadata } from "next";
import WizardClient from "@/components/wizard/WizardClient";

export const metadata: Metadata = {
  title: "Ayuda Finder",
  description:
    "Answer a few quick questions about your situation and get matched with Philippine government benefits you may be eligible for.",
  alternates: { canonical: "/wizard" },
};

export default function WizardPage() {
  return <WizardClient />;
}
