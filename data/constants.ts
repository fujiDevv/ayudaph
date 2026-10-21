import type { Hotline, Program } from "@/lib/types";
import programsData from "@/data/programs.json";

export const programs = programsData as Program[];

export const hotlines: Hotline[] = [
  {
    agency: "DSWD (Dept. of Social Welfare & Dev.)",
    numbers: [
      { label: "(02) 8931-8101 to 07", dial: "0289318101" },
      { label: "Hotline 8888", dial: "8888" },
    ],
    purpose: "Crisis relief, financial aid, indigent reports",
    emails: ["inquiry@dswd.gov.ph", "ciu.co@dswd.gov.ph"],
  },
  {
    agency: "SSS (Social Security System)",
    numbers: [
      { label: "1455", dial: "1455" },
    ],
    purpose: "Private sector pension, unemployment, sickness claims",
    emails: ["usssaptayo@sss.gov.ph"],
  },
  {
    agency: "PhilHealth (Philippine Health Insurance Corp.)",
    numbers: [
      { label: "(02) 8662-2588", dial: "0286622588" },
      { label: "Smart: 0998-857-2957", dial: "09988572957" },
      { label: "Globe: 0917-127-5987", dial: "09171275987" },
    ],
    purpose: "Hospital coverage, medical benefits support",
    emails: ["actioncenter@philhealth.gov.ph"],
  },
  {
    agency: "Pag-IBIG Fund (HDMF)",
    numbers: [
      { label: "(02) 8724-4244", dial: "0287244244" },
      { label: "*4363 (Mobile Shortcode)", dial: "*4363" },
    ],
    purpose: "Housing loans, multi-purpose loans, savings programs",
    emails: ["contactus@pagibigfund.gov.ph"],
  },
  {
    agency: "GSIS (Government Service Insurance System)",
    numbers: [
      { label: "(02) 8847-4747", dial: "0288474747" },
      { label: "Toll-Free: 1-800-8-847-4747 (Globe/TM)", dial: "180088474747" },
      { label: "1-800-10-847-4747 (Smart/TNT)", dial: "1800108474747" },
    ],
    purpose: "Public sector pensions, calamity & policy loans",
    emails: ["gsiscares@gsis.gov.ph"],
  },
  {
    agency: "DOLE (Department of Labor & Employment)",
    numbers: [
      { label: "1349 (Toll-Free Hotline)", dial: "1349" },
    ],
    purpose: "Employment issues, TUPAD claims, labor grievances",
    emails: ["osec@dole.gov.ph"],
  },
  {
    agency: "DOH (Department of Health)",
    numbers: [
      { label: "(02) 8651-7800", dial: "0286517800" },
    ],
    purpose: "Malasakit Centers medical assistance, primary health policies",
    emails: ["callcenter@doh.gov.ph"],
  },
  {
    agency: "OWWA (Overseas Workers Welfare Admin.)",
    numbers: [
      { label: "1348 (Toll-Free)", dial: "1348" },
      { label: "(+632) 1348", dial: "+6321348" },
    ],
    purpose: "OFW scholarship, repatriation, and livelihood programs",
    emails: ["opcenter@owwa.gov.ph"],
  },
];

export const audienceTags = [
  "All Citizens",
  "Indigent",
  "Low Income",
  "Employed",
  "Unemployed",
  "Seniors",
  "Students",
  "Mothers",
  "Pregnant",
  "OFW",
  "Government Employees",
];

/** Unique agencies in the directory, alphabetically sorted. */
export const agencies: string[] = Array.from(
  new Set(programs.map((p) => p.agency)),
).sort((a, b) => a.localeCompare(b));

/** Unique categories split on "/" so compound labels filter individually. */
export const categories: string[] = Array.from(
  new Set(
    programs.flatMap((p) =>
      p.category.split("/").map((c) => c.trim()),
    ),
  ),
).sort((a, b) => a.localeCompare(b));

/** All target-audience tags that actually appear in the dataset. */
export const activeAudienceTags: string[] = Array.from(
  new Set(programs.flatMap((p) => p.target_audience)),
).sort((a, b) => a.localeCompare(b));

/** Distinct agency labels used for filtering, sorted by program count. */
export const agencyCounts: { agency: string; count: number }[] = agencies
  .map((agency) => ({
    agency,
    count: programs.filter((p) => p.agency === agency).length,
  }))
  .sort((a, b) => b.count - a.count);
