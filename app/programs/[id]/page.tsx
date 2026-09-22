import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetail from "@/components/directory/ProgramDetail";
import { programs } from "@/data/constants";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Program } from "@/lib/types";
import { toMetaDescription } from "@/lib/utils";

interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return programs.map((program) => ({ id: program.id }));
}

export async function generateMetadata({
  params,
}: ProgramPageProps): Promise<Metadata> {
  const { id } = await params;
  const program = programs.find((item) => item.id === id);
  if (!program) return { title: "Program not found" };
  return {
    title: program.name,
    // Program copy runs long (some past 300 characters); search engines
    // truncate far earlier, so cap it at a SERP-friendly length.
    description: toMetaDescription(program.description),
    alternates: { canonical: `/programs/${program.id}` },
    openGraph: {
      type: "article",
      title: `${program.name} | ${SITE_NAME}`,
      description: program.description,
      url: `/programs/${program.id}`,
      images: [OG_IMAGE],
    },
  };
}

/**
 * Structured data for a single benefit program.
 *
 * `Service` describes the benefit and the agency that provides it, `HowTo`
 * mirrors the numbered application steps already rendered on the page, and
 * `BreadcrumbList` gives search engines the directory > program path.
 */
function buildProgramJsonLd(program: Program) {
  const url = `${SITE_URL}/programs/${program.id}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: program.name,
        description: program.description,
        serviceType: program.category,
        url,
        isAccessibleForFree: true,
        provider: {
          "@type": "GovernmentOrganization",
          name: program.agency,
          url: program.official_url,
        },
        areaServed: { "@type": "Country", name: "Philippines" },
        audience: {
          "@type": "Audience",
          audienceType: program.target_audience.join(", "),
        },
      },
      {
        "@type": "HowTo",
        name: `How to apply for ${program.name}`,
        description: `Application process, requirements, and processing time for ${program.name} in the Philippines.`,
        step: program.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text: step,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Benefits Directory",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: program.name,
            item: url,
          },
        ],
      },
    ],
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const program = programs.find((item) => item.id === id);
  if (!program) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProgramJsonLd(program)),
        }}
      />
      <ProgramDetail programId={id} />
    </>
  );
}
