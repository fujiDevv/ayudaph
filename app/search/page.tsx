import type { Metadata } from "next";
import DirectoryClient from "@/components/directory/DirectoryClient";

export const metadata: Metadata = {
  title: "Search benefits",
  description:
    "Search across Philippine government social benefit programs by keyword, agency, category, or target audience.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return <DirectoryClient />;
}
