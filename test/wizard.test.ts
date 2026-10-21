import { describe, expect, it } from "vitest";
import { programs } from "@/data/constants";
import {
  MIN_RECOMMENDATION_SCORE,
  recommendPrograms,
  scoreProgram,
  type WizardAnswers,
} from "@/lib/wizard";
import type { Program } from "@/lib/types";

/**
 * Defaults deliberately use a neutral category and empty tags/audiences so each
 * test isolates a single scoring dimension.
 */
function makeProgram(overrides: Partial<Program> = {}): Program {
  return {
    id: "p",
    agency: "DSWD",
    name: "Test Program",
    category: "General",
    description: "Test",
    target_audience: [],
    processing_time: "1 day",
    official_url: "https://example.gov.ph",
    steps: [],
    requirements: [],
    requirement_ids: [],
    tags: [],
    ...overrides,
  };
}

/** Answers that match nothing, so a single rule can be tested in isolation. */
const neutral: WizardAnswers = {
  status: "Unspecified",
  need: "none",
  demographics: [],
};

describe("scoreProgram", () => {
  it("does not confuse employed, unemployed, and self-employed audiences", () => {
    const answers = { ...neutral, status: "Unemployed" };
    for (const audience of ["Employed", "Self-Employed", "Underemployed"]) {
      expect(scoreProgram(makeProgram({ target_audience: [audience] }), answers)).toBe(0);
    }
    expect(scoreProgram(makeProgram({ target_audience: ["OFWs"] }), { ...neutral, status: "OFW" })).toBe(4);
  });

  it("excludes unemployment benefits for currently employed applicants", () => {
    for (const status of ["Employed", "Government Employees"]) {
      const results = recommendPrograms(programs, { status, need: "financial", demographics: [] });
      expect(results.some(program => program.id === "sss-unemp")).toBe(false);
    }
    expect(recommendPrograms(programs, { status: "Unemployed", need: "financial", demographics: [] })
      .some(program => program.id === "sss-unemp")).toBe(true);
  });
  it("awards 4 points when an audience matches the status", () => {
    const program = makeProgram({ target_audience: ["Employed"] });
    expect(scoreProgram(program, { ...neutral, status: "Employed" })).toBe(4);
  });

  it("awards 5 points when a tag matches the need", () => {
    const program = makeProgram({ tags: ["financial"] });
    expect(scoreProgram(program, { ...neutral, need: "financial" })).toBe(5);
  });

  it("awards 5 points when the category matches the need", () => {
    const program = makeProgram({ category: "Medical Assistance" });
    expect(scoreProgram(program, { ...neutral, need: "medical" })).toBe(5);
  });

  it("does not double count a need that matches both tag and category", () => {
    const program = makeProgram({ category: "Financial", tags: ["financial"] });
    expect(scoreProgram(program, { ...neutral, need: "financial" })).toBe(5);
  });

  it("adds the SSS bonus for employed applicants", () => {
    const program = makeProgram({ target_audience: ["SSS Members"] });
    expect(scoreProgram(program, { ...neutral, status: "Employed" })).toBe(3);
  });

  it("adds the GSIS bonus for government employees", () => {
    const program = makeProgram({ target_audience: ["Government Employees"] });
    expect(
      scoreProgram(program, { ...neutral, status: "Government Employees" }),
    ).toBe(8);
  });

  it("awards 3 points per matching demographic", () => {
    const program = makeProgram({ target_audience: ["Seniors"] });
    expect(
      scoreProgram(program, { ...neutral, demographics: ["Seniors"] }),
    ).toBe(3);
  });

  it("stacks multiple matching demographics", () => {
    const program = makeProgram({ target_audience: ["Seniors", "PWD"] });
    expect(
      scoreProgram(program, { ...neutral, demographics: ["Seniors", "PWD"] }),
    ).toBe(6);
  });

  it("awards 1 point for the All Citizens catch-all", () => {
    const program = makeProgram({ target_audience: ["All Citizens"] });
    expect(scoreProgram(program, neutral)).toBe(1);
  });

  it("scores zero when nothing matches", () => {
    expect(scoreProgram(makeProgram(), { ...neutral, status: "Martian" })).toBe(0);
  });
});

describe("recommendPrograms", () => {
  const answers: WizardAnswers = {
    status: "Employed",
    need: "financial",
    demographics: [],
  };

  it("drops programs at or below the recommendation threshold", () => {
    const weak = makeProgram({ id: "weak", target_audience: ["All Citizens"] });
    const strong = makeProgram({
      id: "strong",
      target_audience: ["Employed"],
      tags: ["financial"],
    });

    expect(scoreProgram(weak, answers)).toBeLessThanOrEqual(
      MIN_RECOMMENDATION_SCORE,
    );
    expect(recommendPrograms([weak, strong], answers).map((p) => p.id)).toEqual([
      "strong",
    ]);
  });

  it("sorts recommendations by descending score", () => {
    const low = makeProgram({ id: "low", target_audience: ["Employed"] });
    const high = makeProgram({
      id: "high",
      target_audience: ["Employed"],
      tags: ["financial"],
    });

    expect(scoreProgram(high, answers)).toBeGreaterThan(scoreProgram(low, answers));
    expect(recommendPrograms([low, high], answers).map((p) => p.id)).toEqual([
      "high",
      "low",
    ]);
  });

  it("returns an empty list when nothing qualifies", () => {
    expect(
      recommendPrograms(programs, {
        status: "Martian",
        need: "unobtainium",
        demographics: [],
      }),
    ).toEqual([]);
  });

  it("returns matches against the real dataset", () => {
    const results = recommendPrograms(programs, {
      status: "Employed",
      need: "financial",
      demographics: ["Indigent"],
    });
    expect(results.length).toBeGreaterThan(0);
    const ids = new Set(programs.map((p) => p.id));
    results.forEach((program) => expect(ids.has(program.id)).toBe(true));
  });
});
