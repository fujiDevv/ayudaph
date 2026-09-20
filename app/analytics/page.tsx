import type { Metadata } from "next";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Data Analytics",
  description:
    "Insights into the Philippine social assistance landscape: programs by agency, category, target audience, and tag.",
  alternates: { canonical: "/analytics" },
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
