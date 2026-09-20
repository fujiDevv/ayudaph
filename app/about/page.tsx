import type { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "About Ayuda",
  description:
    "Ayuda is an independent, open-source navigator for Philippine government social benefits, created and maintained by Joshua Sarmiento.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
