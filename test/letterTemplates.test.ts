import { describe, expect, it } from "vitest";
import {
  buildLetterHTML,
  type LetterForm,
} from "@/components/assistance/letterTemplates";

/** Minimal translator stub that echoes the last path segment. */
const t = (key: string) => key.split(".").pop() as string;

const emptyForm: LetterForm = {
  date: "2026-09-20",
  applicantName: "",
  applicantAddress: "",
  repName: "",
  repAddress: "",
  relationship: "",
  purposeAuth: "",
  explanationAuth: "",
  monthlyIncome: "",
  livelihood: "",
  dependents: "1",
  purposeAffidavit: "",
  governmentId: "",
  recipient: "",
  office: "",
  officeAddress: "",
  patientName: "",
  relationshipToPatient: "",
  purposeRequest: "",
  explanationRequest: "",
};

const filledForm: LetterForm = {
  ...emptyForm,
  applicantName: "Juan Dela Cruz",
  applicantAddress: "123 Mabini St, Quezon City",
  repName: "Maria Dela Cruz",
  repAddress: "45 Rizal Ave, Caloocan",
  relationship: "sister",
  purposeAuth: "claim the cash assistance",
  explanationAuth: "I am hospitalized",
  monthlyIncome: "₱5,000",
  livelihood: "street vendor",
  dependents: "3",
  purposeAffidavit: "DSWD AICS",
  governmentId: "UMID 1234-5678",
  recipient: "Hon. Mayor Jane Reyes",
  office: "City Social Welfare and Development Office",
  officeAddress: "City Hall, Quezon City",
  patientName: "Pedro Dela Cruz",
  relationshipToPatient: "father",
  purposeRequest: "hospitalization expenses",
  explanationRequest: "he was hospitalized last week",
};

describe("buildLetterHTML", () => {
  it("renders bracketed placeholders for empty fields", () => {
    const html = buildLetterHTML("authorization", "en", emptyForm, t);
    expect(html).toContain("[applicantName]");
    expect(html).toContain("[repName]");
    expect(html).toContain("[purpose]");
  });

  it("inserts the supplied values", () => {
    const html = buildLetterHTML("authorization", "en", filledForm, t);
    expect(html).toContain("Juan Dela Cruz");
    expect(html).toContain("Maria Dela Cruz");
    expect(html).toContain("claim the cash assistance");
    expect(html).toContain("LETTER OF AUTHORIZATION");
  });

  it("localises the authorization letter into Tagalog", () => {
    const html = buildLetterHTML("authorization", "tl", filledForm, t);
    expect(html).toContain("SULAT NG PAGPAPAHINTULOT");
    expect(html).toContain("SA KINAUUKULAN");
  });

  it("escapes HTML in user input to prevent injection", () => {
    const html = buildLetterHTML(
      "authorization",
      "en",
      { ...filledForm, applicantName: "<script>alert(1)</script>" },
      t,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("builds the low-income affidavit with income and dependents", () => {
    const html = buildLetterHTML("low_income", "en", filledForm, t);
    expect(html).toContain("AFFIDAVIT OF LOW INCOME");
    expect(html).toContain("₱5,000");
    expect(html).toContain("street vendor");
    expect(html).toContain("3</strong> dependent");
    expect(html).toContain("UMID 1234-5678");
    expect(html).toContain("JURAT");
  });

  it("falls back to a blank line for a missing government ID", () => {
    const html = buildLetterHTML("low_income", "en", emptyForm, t);
    expect(html).toContain("____________________");
  });

  it("uses a generic subject when no patient is named", () => {
    const html = buildLetterHTML(
      "request",
      "en",
      { ...filledForm, patientName: "", relationshipToPatient: "" },
      t,
    );
    expect(html).toContain("REQUEST FOR FINANCIAL/MEDICAL ASSISTANCE");
    expect(html).toContain("Hon. Mayor Jane Reyes");
    expect(html).not.toContain("REQUEST FOR ASSISTANCE FOR MY");
  });

  it("names the patient in the subject when provided", () => {
    const html = buildLetterHTML("request", "en", filledForm, t);
    expect(html).toContain("REQUEST FOR ASSISTANCE FOR MY FATHER");
    expect(html).toContain("PEDRO DELA CRUZ");
  });

  it("renders the Tagalog request letter subject", () => {
    const html = buildLetterHTML("request", "tl", filledForm, t);
    expect(html).toContain("PAKSA:");
    expect(html).toContain("HILING PARA SA TULONG");
  });

  it("formats the date for the selected locale", () => {
    const html = buildLetterHTML("authorization", "en", filledForm, t);
    expect(html).toMatch(/September 20, 2026/);
  });
});
