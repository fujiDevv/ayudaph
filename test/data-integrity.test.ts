import { describe, expect, it } from "vitest";
import programsData from "@/data/programs.json";
import { activeAudienceTags, agencies, categories, hotlines, programs } from "@/data/constants";
import en from "@/lib/i18n/en.json";
import tl from "@/lib/i18n/tl.json";
import { splitCategory } from "@/lib/filtering";

type LocaleMessages = typeof en;

const LOCALES: { code: string; messages: LocaleMessages }[] = [
  { code: "en", messages: en },
  { code: "tl", messages: tl },
];

describe("program dataset", () => {
  it("loads every program with a unique id", () => {
    expect(programs.length).toBe(20);
    const ids = programs.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every program a complete, non-empty shape", () => {
    programs.forEach((program) => {
      expect(program.id, "id").toBeTruthy();
      expect(program.agency, `${program.id} agency`).toBeTruthy();
      expect(program.name, `${program.id} name`).toBeTruthy();
      expect(program.category, `${program.id} category`).toBeTruthy();
      expect(program.description.length, `${program.id} description`).toBeGreaterThan(20);
      expect(program.processing_time, `${program.id} processing_time`).toBeTruthy();
      expect(program.official_url).toMatch(/^https:\/\//);
      expect(program.steps.length, `${program.id} steps`).toBeGreaterThan(0);
      expect(program.requirements.length, `${program.id} requirements`).toBeGreaterThan(0);
      expect(program.requirement_ids.length).toBe(program.requirements.length);
      expect(new Set(program.requirement_ids).size).toBe(program.requirements.length);
      expect(program.target_audience.length, `${program.id} audience`).toBeGreaterThan(0);
      expect(program.tags.length, `${program.id} tags`).toBeGreaterThan(0);
    });
  });

  it("keeps agencies, categories and audiences in sync with the data", () => {
    expect(agencies).toEqual(
      Array.from(new Set(programs.map((p) => p.agency))).sort((a, b) =>
        a.localeCompare(b),
      ),
    );

    const expectedCategories = Array.from(
      new Set(programs.flatMap((p) => splitCategory(p.category))),
    ).sort((a, b) => a.localeCompare(b));
    expect(categories).toEqual(expectedCategories);

    const expectedAudiences = Array.from(
      new Set(programs.flatMap((p) => p.target_audience)),
    ).sort((a, b) => a.localeCompare(b));
    expect(activeAudienceTags).toEqual(expectedAudiences);
  });
});

describe("locale parity", () => {
  LOCALES.forEach(({ code, messages }) => {
    it(`[${code}] provides name, description, steps and requirements for every program`, () => {
      programs.forEach((program) => {
        const entry = messages.programs[program.id as keyof typeof messages.programs];
        expect(entry, `${program.id} missing from ${code}.json`).toBeDefined();
        expect(entry.name, `${program.id} name`).toBeTruthy();
        expect(entry.description.length, `${program.id} description`).toBeGreaterThan(20);
        expect(entry.steps.length, `${program.id} steps`).toBeGreaterThan(0);
        expect(entry.requirements.length, `${program.id} requirements`).toBeGreaterThan(0);
      });
    });

    it(`[${code}] keeps step and requirement counts aligned with the dataset`, () => {
      programs.forEach((program) => {
        const entry = messages.programs[program.id as keyof typeof messages.programs];
        expect(
          entry.steps.length,
          `${program.id} step count`,
        ).toBe(program.steps.length);
        expect(
          entry.requirements.length,
          `${program.id} requirement count`,
        ).toBe(program.requirements.length);
      });
    });

    it(`[${code}] defines the top-level UI sections`, () => {
      ["header", "nav", "navbar", "filters", "card", "detail", "footer"].forEach(
        (section) => {
          expect(
            (messages as Record<string, unknown>)[section],
            `${code} missing "${section}"`,
          ).toBeDefined();
        },
      );
    });
  });

  it("mirrors the same key set between English and Tagalog", () => {
    const collect = (value: unknown, prefix = ""): string[] => {
      if (value === null || typeof value !== "object") return [prefix];
      return Object.entries(value as Record<string, unknown>).flatMap(
        ([key, child]) => collect(child, prefix ? `${prefix}.${key}` : key),
      );
    };
    const enKeys = collect(en).sort();
    const tlKeys = collect(tl).sort();
    expect(tlKeys).toEqual(enKeys);
  });
});

describe("hotlines", () => {
  it("lists every agency with at least one number and email", () => {
    expect(hotlines.length).toBeGreaterThanOrEqual(8);
    hotlines.forEach((hotline) => {
      expect(hotline.agency, "agency").toBeTruthy();
      expect(hotline.purpose, `${hotline.agency} purpose`).toBeTruthy();
      expect(hotline.numbers.length, `${hotline.agency} numbers`).toBeGreaterThan(0);
      hotline.numbers.forEach(number => {
        expect(number.label).toBeTruthy();
        expect(number.dial).toMatch(/^[+*]?\d+$/);
      });
      expect(hotline.emails.length, `${hotline.agency} emails`).toBeGreaterThan(0);
      hotline.emails.forEach((email) => expect(email).toMatch(/@/));
    });
  });
});

it("preserves hotline area codes, country codes, and shortcodes", () => {
  const numbers = hotlines.flatMap(hotline => hotline.numbers);
  expect(numbers.find(number => number.label === "(02) 8931-8101 to 07")?.dial).toBe("0289318101");
  expect(numbers.find(number => number.label === "(+632) 1348")?.dial).toBe("+6321348");
  expect(numbers.find(number => number.label === "*4363 (Mobile Shortcode)")?.dial).toBe("*4363");
});

describe("data freshness", () => {
  it("records the 2026 4Ps First 1,000 Days grant increase", () => {
    const description = programs.find((p) => p.id === "dswd-4ps")!.description;
    expect(description).toContain("₱750");
    expect(description).toContain("F1KD");
    expect(en.programs["dswd-4ps"].description).toContain("₱750");
    expect(tl.programs["dswd-4ps"].description).toContain("₱750");
  });

  it("omits the defunded AKAP program", () => {
    // AKAP (Ayuda sa Kapos ang Kita Program) was defunded in the 2026 budget.
    // Match the specific program name so PhilHealth's YAKAP is not caught.
    const akap = programsData.filter((p) =>
      /ayuda sa kapos|kapos ang kita/i.test(p.name),
    );
    expect(akap).toEqual([]);
    expect(akap.some((p) => p.id === "dswd-akap")).toBe(false);
    // YAKAP must still be present, since it is a separate PhilHealth program.
    expect(programs.some((p) => p.id === "philhealth-yakap")).toBe(true);
  });
});
