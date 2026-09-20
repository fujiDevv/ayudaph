import type { Metadata } from "next";
import HotlinesList from "@/components/hotlines/HotlinesList";

export const metadata: Metadata = {
  title: "Agency hotlines",
  description:
    "Direct hotlines, support emails, and inquiry channels for DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, and OWWA.",
  alternates: { canonical: "/hotlines" },
};

export default function HotlinesPage() {
  return <HotlinesList />;
}
