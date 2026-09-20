import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetail from "@/components/directory/ProgramDetail";
import { programs } from "@/data/constants";
import { OG_IMAGE } from "@/lib/site";

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
    description: program.description,
    alternates: { canonical: `/programs/${program.id}` },
    openGraph: {
      type: "article",
      title: `${program.name} | Ayuda`,
      description: program.description,
      url: `/programs/${program.id}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const program = programs.find((item) => item.id === id);
  if (!program) notFound();
  return <ProgramDetail programId={id} />;
}
