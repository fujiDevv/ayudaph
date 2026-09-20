import type { Metadata } from "next";
import AssistanceClient from "@/components/assistance/AssistanceClient";

export const metadata: Metadata = {
  title: "Document Prep",
  description:
    "Draft authorization letters, affidavits of low income, and request letters, with step-by-step guides for prerequisite certificates.",
  alternates: { canonical: "/assistance" },
};

export default function AssistancePage() {
  return <AssistanceClient />;
}
