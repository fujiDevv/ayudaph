import type { Metadata } from "next";
import SitemapClient from "@/components/sitemap/SitemapClient";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Find every page and tool in the Ayuda benefits navigator.",
  alternates: { canonical: "/sitemap" },
};

export default function SitemapPage() {
  return <SitemapClient />;
}
