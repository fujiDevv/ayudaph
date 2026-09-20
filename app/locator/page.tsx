import type { Metadata } from "next";
import BranchLocator from "@/components/locator/BranchLocator";

export const metadata: Metadata = {
  title: "Branch Locator",
  description:
    "Find nearby DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, and OWWA branches on an interactive OpenStreetMap.",
  alternates: { canonical: "/locator" },
};

export default function LocatorPage() {
  return <BranchLocator />;
}
