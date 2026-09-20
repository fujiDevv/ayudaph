import type { Metadata } from "next";
import ShortlistClient from "@/components/shortlist/ShortlistClient";

export const metadata: Metadata = {
  title: "Saved benefits",
  description:
    "Review the Philippine government benefits you bookmarked, along with their document checklists.",
  alternates: { canonical: "/shortlist" },
};

export default function ShortlistPage() {
  return <ShortlistClient />;
}
