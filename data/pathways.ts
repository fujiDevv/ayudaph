export type PathwayKey =
  | "baby"
  | "death"
  | "job_loss"
  | "retirement"
  | "student"
  | "family";

export interface PathwayItem {
  /** When set, requirements/steps are pulled from the program's locale entry. */
  programId?: string;
  /** Custom (non-directory) items carry their own copy. */
  name?: string;
  agency: string;
  purpose: string;
  requirements?: string[];
  steps?: string[];
}

export interface Pathway {
  key: PathwayKey;
  titleKey: string;
  descKey: string;
  tipsKey: string;
  /** Lucide icon name resolved in the component. */
  icon: string;
  /** Tailwind classes for the soft accent chip on this pathway's cards. */
  accent: string;
  items: PathwayItem[];
}

export const pathways: Pathway[] = [
  {
    key: "baby",
    titleKey: "pathways.babyTitle",
    descKey: "pathways.babyDesc",
    tipsKey: "pathways.babyTips",
    icon: "Baby",
    accent: "bg-rose-50 text-rose-600 border-rose-200",
    items: [
      {
        programId: "sss-maternity",
        agency: "SSS",
        purpose:
          "Provides cash allowance to SSS female members who gave birth or suffered a miscarriage.",
      },
      {
        programId: "philhealth-newborn",
        agency: "PhilHealth",
        purpose:
          "Covers essential diagnostic tests, physical exams, and initial vaccines for newborns.",
      },
      {
        name: "Pag-IBIG Membership Registration",
        agency: "Pag-IBIG",
        purpose:
          "Ensures the child can be registered or parents can update their beneficiary data for housing/savings programs.",
        requirements: [
          "Valid government ID of the parent/member",
          "Child's birth certificate (PSA copy)",
          "Completed Member's Data Form (MDF)",
        ],
        steps: [
          "Visit the Virtual Pag-IBIG portal online or nearest branch.",
          "Fill out the MDF form to register or update membership records.",
          "Submit the copy of the child's birth certificate for beneficiary registration.",
        ],
      },
    ],
  },
  {
    key: "death",
    titleKey: "pathways.deathTitle",
    descKey: "pathways.deathDesc",
    tipsKey: "pathways.deathTips",
    icon: "Heart",
    accent: "bg-indigo-50 text-indigo-600 border-indigo-200",
    items: [
      {
        programId: "sss-funeral",
        agency: "SSS",
        purpose: "Reimburses up to ₱40,000 of funeral expenses for SSS members.",
      },
      {
        programId: "gsis-funeral",
        agency: "GSIS",
        purpose:
          "Provides a fixed ₱30,000 funeral grant for deceased government workers.",
      },
      {
        programId: "dswd-aics",
        agency: "DSWD",
        purpose:
          "Provides direct financial assistance or guarantee letters for indigent families to cover funeral bills.",
      },
      {
        name: "PSA Death Certificate Registration",
        agency: "Local Civil Registry / PSA",
        purpose: "Prerequisite document needed for all other claim processing.",
        requirements: [
          "Certified copy of the Death Certificate signed by attending doctor",
          "Informant's valid ID",
          "Barangay certificate of residency of the deceased",
        ],
        steps: [
          "Register the death at the Local Civil Registry Office (LCRO) of the city/municipality where it occurred.",
          "Obtain registered local copies.",
          "Request official security paper PSA Death Certificates after the LCR transmits records.",
        ],
      },
    ],
  },
  {
    key: "job_loss",
    titleKey: "pathways.jobLossTitle",
    descKey: "pathways.jobLossDesc",
    tipsKey: "pathways.jobLossTips",
    icon: "Briefcase",
    accent: "bg-teal-50 text-teal-600 border-teal-200",
    items: [
      {
        programId: "sss-unemp",
        agency: "SSS",
        purpose:
          "Provides temporary cash allowances for involuntarily separated SSS members.",
      },
      {
        programId: "dole-tupad",
        agency: "DOLE",
        purpose:
          "Offers emergency community cleaning/maintenance jobs (10-30 days) for immediate cash.",
      },
      {
        programId: "tesda-training",
        agency: "TESDA",
        purpose:
          "Provides free vocational training courses and entrepreneurship toolkits to upskill workers.",
      },
    ],
  },
  {
    key: "retirement",
    titleKey: "pathways.retirementTitle",
    descKey: "pathways.retirementDesc",
    tipsKey: "pathways.retirementTips",
    icon: "HeartHandshake",
    accent: "bg-accent-50 text-accent-700 border-accent-200",
    items: [
      {
        programId: "sss-retirement",
        agency: "SSS",
        purpose:
          "Provides a lifetime monthly pension or lump sum benefit to retired SSS members.",
      },
      {
        programId: "gsis-retirement",
        agency: "GSIS",
        purpose:
          "Ensures retired government employees receive monthly annuity pensions and cash benefits.",
      },
      {
        programId: "dswd-spisc",
        agency: "DSWD",
        purpose:
          "Provides indigent seniors with a ₱1,000 monthly allowance for basic livelihood.",
      },
      {
        name: "LGU Senior Citizen ID Application",
        agency: "OSCA / LGU",
        purpose:
          "Secures a Senior Citizen ID to avail of 20% discounts, VAT exemptions, and free medical checkups.",
        requirements: [
          "Completed OSCA Application Form",
          "Birth Certificate (PSA copy) or valid passport proving age (60+)",
          "Barangay Certification of Residency (minimum 6 months)",
          "1x1 recent ID photo (white background)",
        ],
        steps: [
          "Visit the Office for Senior Citizens Affairs (OSCA) or social welfare desk in your LGU.",
          "Submit the application form and age verification documents.",
          "Undergo immediate processing and validation of your residency.",
          "Receive your physical Senior Citizen ID card and booklet for purchasing medicine.",
        ],
      },
    ],
  },
  {
    key: "student",
    titleKey: "pathways.studentTitle",
    descKey: "pathways.studentDesc",
    tipsKey: "pathways.studentTips",
    icon: "GraduationCap",
    accent: "bg-primary-50 text-primary-600 border-primary-200",
    items: [
      {
        programId: "ched-tes",
        agency: "CHED / UniFAST",
        purpose:
          "Provides tertiary education grants to cover tuition, allowances, and other learning expenses.",
      },
      {
        programId: "owwa-edsp",
        agency: "OWWA",
        purpose:
          "Grants educational scholarships of up to ₱60,000 per school year for dependents of active OFWs.",
      },
      {
        programId: "tesda-training",
        agency: "TESDA",
        purpose:
          "Offers free vocational skills training, entrepreneurship tools, and national certifications.",
      },
    ],
  },
  {
    key: "family",
    titleKey: "pathways.familyTitle",
    descKey: "pathways.familyDesc",
    tipsKey: "pathways.familyTips",
    icon: "Users",
    accent: "bg-purple-50 text-purple-600 border-purple-200",
    items: [
      {
        programId: "lgu-soloparent",
        agency: "LGU / DSWD",
        purpose:
          "Grants expanded single-parent subsidies, tax breaks, and child care discounts.",
      },
      {
        programId: "dswd-4ps",
        agency: "DSWD",
        purpose:
          "Provides conditional health and educational cash grants to indigent Filipino families.",
      },
      {
        programId: "dswd-aics",
        agency: "DSWD",
        purpose:
          "Offers direct financial, food, and medical aid to families dealing with immediate crises.",
      },
    ],
  },
];
