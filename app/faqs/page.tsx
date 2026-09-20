import type { Metadata } from "next";
import FaqsClient from "@/components/faqs/FaqsClient";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers about Ayuda's independence, privacy-first design, data sources, and how to contribute.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsPage() {
  return <FaqsClient />;
}
