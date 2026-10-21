import type { Program } from "./types";

export interface WizardAnswers {
  /** Employment / life status, matched against target audiences and tags. */
  status: string;
  /** Primary area of need (medical, financial, housing, education). */
  need: string;
  /** Optional extra demographic tags. */
  demographics: string[];
}

/** Programs must clear this score to be recommended. */
export const MIN_RECOMMENDATION_SCORE = 2;

function audienceMatches(values: string[], candidate: string): boolean {
  const lower = candidate.toLowerCase();
  const aliases: Record<string, string[]> = { ofw: ["ofw", "ofws"] };
  return values.some((value) =>
    (aliases[lower] ?? [lower]).includes(value.toLowerCase()),
  );
}

/** Score a single program against the visitor's answers. */
export function scoreProgram(program: Program, answers: WizardAnswers): number {
  let score = 0;
  const statusLower = answers.status.toLowerCase();

  // SSS unemployment requires involuntary separation. Other programs may list
  // unemployment alongside independent audiences, so do not exclude those.
  if (
    program.id === "sss-unemp" &&
    ["Employed", "Government Employees"].includes(answers.status)
  ) {
    return 0;
  }

  const matchStatus =
    audienceMatches(program.target_audience, answers.status) ||
    program.tags.some((tag) => tag.toLowerCase() === statusLower);
  if (matchStatus) score += 4;

  if (
    answers.status === "Employed" &&
    program.target_audience.includes("SSS Members")
  ) {
    score += 3;
  }

  if (
    answers.status === "Government Employees" &&
    program.target_audience.includes("Government Employees")
  ) {
    score += 4;
  }

  if (
    program.tags.includes(answers.need) ||
    program.category.toLowerCase().includes(answers.need)
  ) {
    score += 5;
  }

  answers.demographics.forEach((demographic) => {
    const matchDemographic =
      audienceMatches(program.target_audience, demographic) ||
      program.tags.some((tag) => tag.toLowerCase() === demographic.toLowerCase());
    if (matchDemographic) score += 3;
  });

  if (program.target_audience.includes("All Citizens")) score += 1;

  return score;
}

/** Rank programs by eligibility score, dropping weak matches. */
export function recommendPrograms(
  programs: Program[],
  answers: WizardAnswers,
): Program[] {
  return programs
    .map((program) => ({ program, score: scoreProgram(program, answers) }))
    .filter((item) => item.score > MIN_RECOMMENDATION_SCORE)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.program);
}
