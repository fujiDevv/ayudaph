import type { Metadata } from "next";
import PathwaysClient from "@/components/pathways/PathwaysClient";

export const metadata: Metadata = {
  title: "Life Events",
  description:
    "Structured pathways bundling the government programs you need for having a baby, loss of a family member, job loss, retirement, college, and solo parenting.",
  alternates: { canonical: "/pathways" },
};

export default function PathwaysPage() {
  return <PathwaysClient />;
}
