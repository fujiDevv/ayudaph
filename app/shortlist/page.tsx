import type { Metadata } from "next";
import ShortlistClient from "@/components/shortlist/ShortlistClient";

export const metadata: Metadata = {
  title: "Saved benefits",
  description:
    "Review the Philippine government benefits you bookmarked, along with their document checklists.",
  alternates: { canonical: "/shortlist" },
  // Saved benefits live in the visitor's browser only, so the server renders
  // an empty shell. Keep it out of the index rather than submitting a thin page.
  robots: { index: false, follow: true },
};

export default function ShortlistPage() {
  return <ShortlistClient />;
}
