import type { Metadata } from "next";
import DirectoryClient from "@/components/directory/DirectoryClient";

export const metadata: Metadata = {
  title: "Search benefits",
  description:
    "Search across Philippine government social benefit programs by keyword, agency, category, or target audience.",
  alternates: { canonical: "/search" },
  // This route renders the same directory grid as the homepage, so keep it
  // crawlable for discovery but out of the index to avoid duplicate content.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return <DirectoryClient />;
}
