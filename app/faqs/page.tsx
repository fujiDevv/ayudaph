import type { Metadata } from "next";
import FaqsClient from "@/components/faqs/FaqsClient";
import { FAQ_ITEMS } from "@/lib/faqs";
import en from "@/lib/i18n/en.json";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers about Ayuda's independence, privacy-first design, data sources, and how to contribute.",
  alternates: { canonical: "/faqs" },
};

/**
 * FAQPage structured data, built from the same ids the client renders so the
 * markup can never drift from the visible questions. Answers come from the
 * English bundle, which is what the server renders by default.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: en.faqs[`q${item.id}`],
    acceptedAnswer: {
      "@type": "Answer",
      text: en.faqs[`a${item.id}`],
    },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqsClient />
    </>
  );
}
