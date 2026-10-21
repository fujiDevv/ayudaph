"use client";

import {
  AlertCircleIcon,
  Building2Icon,
  CheckCircle2,
  CircleDollarSignIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  MapPinIcon,
  PrinterIcon,
  Wand2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { guides, type GuideKey } from "@/data/guides";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { booleanRecord, readStoredJSON, writeStoredJSON } from "@/lib/storage";
import { buildLetterHTML, type DocType, type LetterForm } from "./letterTemplates";

type Tab = "generator" | "guides";

interface FieldDef {
  name: keyof LetterForm;
  labelKey: string;
  textarea?: boolean;
  type?: string;
}

const DOC_FIELDS: Record<DocType, FieldDef[]> = {
  authorization: [
    { name: "date", labelKey: "date", type: "date" },
    { name: "applicantName", labelKey: "applicantName" },
    { name: "applicantAddress", labelKey: "applicantAddress" },
    { name: "repName", labelKey: "repName" },
    { name: "repAddress", labelKey: "repAddress" },
    { name: "relationship", labelKey: "relationship" },
    { name: "purposeAuth", labelKey: "purpose" },
    { name: "explanationAuth", labelKey: "explanation", textarea: true },
  ],
  low_income: [
    { name: "date", labelKey: "date", type: "date" },
    { name: "applicantName", labelKey: "applicantName" },
    { name: "applicantAddress", labelKey: "applicantAddress" },
    { name: "monthlyIncome", labelKey: "monthlyIncome" },
    { name: "livelihood", labelKey: "livelihood" },
    { name: "dependents", labelKey: "dependents", type: "number" },
    { name: "purposeAffidavit", labelKey: "purpose" },
    { name: "governmentId", labelKey: "governmentId" },
  ],
  request: [
    { name: "date", labelKey: "date", type: "date" },
    { name: "applicantName", labelKey: "applicantName" },
    { name: "applicantAddress", labelKey: "applicantAddress" },
    { name: "recipient", labelKey: "recipient" },
    { name: "office", labelKey: "office" },
    { name: "officeAddress", labelKey: "officeAddress" },
    { name: "patientName", labelKey: "patientName" },
    { name: "relationshipToPatient", labelKey: "relationship" },
    { name: "purposeRequest", labelKey: "purpose" },
    { name: "explanationRequest", labelKey: "explanation", textarea: true },
  ],
};

const REQUIRED: Record<DocType, (keyof LetterForm)[]> = {
  authorization: [
    "applicantName",
    "applicantAddress",
    "repName",
    "repAddress",
    "relationship",
    "purposeAuth",
    "explanationAuth",
  ],
  low_income: [
    "applicantName",
    "applicantAddress",
    "monthlyIncome",
    "livelihood",
    "purposeAffidavit",
  ],
  request: [
    "applicantName",
    "applicantAddress",
    "recipient",
    "office",
    "officeAddress",
    "purposeRequest",
    "explanationRequest",
  ],
};

const GUIDES_CHECKED_KEY = "ayuda_guide_checked";

export default function AssistanceClient() {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState<Tab>("generator");

  const [docType, setDocType] = useState<DocType>("authorization");
  const [form, setForm] = useState<LetterForm>({
    date: new Date().toISOString().substring(0, 10),
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [guideKey, setGuideKey] = useState<GuideKey>("indigency");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(booleanRecord(readStoredJSON(GUIDES_CHECKED_KEY)));
  }, []);

  const toggleChecked = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeStoredJSON(GUIDES_CHECKED_KEY, next);
      return next;
    });
  };

  const setField = (name: keyof LetterForm, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const letterHTML = useMemo(
    () => buildLetterHTML(docType, locale, form, t),
    [docType, locale, form, t],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    REQUIRED[docType].forEach((field) => {
      if (!form[field].trim()) {
        const label =
          DOC_FIELDS[docType].find((f) => f.name === field)?.labelKey ?? field;
        next[field] = `${t(`assistance.${label}`)} is required`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePrint = () => {
    if (!validate()) return;
    window.print();
  };

  const activeGuide = guides.find((g) => g.key === guideKey)!;
  const bi = (pair: { en: string; tl: string }) =>
    locale === "tl" ? pair.tl : pair.en;

  const guideProgress = useMemo(() => {
    const total = activeGuide.requirements.length + activeGuide.steps.length;
    if (total === 0) return 0;
    let done = 0;
    activeGuide.requirements.forEach((r) => {
      if (checked[r.id]) done++;
    });
    activeGuide.steps.forEach((s) => {
      if (checked[s.id]) done++;
    });
    return Math.round((done / total) * 100);
  }, [activeGuide, checked]);

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-hidden focus:ring-1 focus:ring-primary-500";

  return (
    <>
      <PageHeader
        title={t("assistance.title")}
        subtitle={t("assistance.desc")}
        crumbs={[{ label: t("nav.assistance") }]}
        icon={<FileTextIcon className="h-6 w-6" />}
      />

      {/* Print-only copy of the document */}
      <div className="hidden print:block p-12 text-black bg-white font-serif text-sm leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: letterHTML }} />
      </div>

      <div className="container mx-auto px-4 py-10 print:hidden">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
          {(
            [
              { key: "generator", label: t("assistance.tabGenerator"), icon: Wand2Icon },
              { key: "guides", label: t("assistance.tabGuides"), icon: FileTextIcon },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-pressed={tab === item.key}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
                  tab === item.key
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-800",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === "generator" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                {t("assistance.formTitle")}
              </h2>

              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                {t("assistance.docType")}
              </label>
              <select
                value={docType}
                onChange={(e) => {
                  setDocType(e.target.value as DocType);
                  setErrors({});
                }}
                className={cn(inputClass, "mb-6 font-semibold")}
              >
                <option value="authorization">{t("assistance.authLetter")}</option>
                <option value="low_income">{t("assistance.affidavitLowIncome")}</option>
                <option value="request">{t("assistance.requestLetter")}</option>
              </select>

              <div className="space-y-4">
                {DOC_FIELDS[docType].map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={`field-${field.name}`}
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      {t(`assistance.${field.labelKey}`)}
                    </label>
                    {field.textarea ? (
                      <textarea
                        id={`field-${field.name}`}
                        rows={3}
                        value={form[field.name]}
                        onChange={(e) => setField(field.name, e.target.value)}
                        className={cn(
                          inputClass,
                          errors[field.name] && "border-error-500",
                        )}
                      />
                    ) : (
                      <input
                        id={`field-${field.name}`}
                        type={field.type ?? "text"}
                        value={form[field.name]}
                        onChange={(e) => setField(field.name, e.target.value)}
                        className={cn(
                          inputClass,
                          errors[field.name] && "border-error-500",
                        )}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="mt-1 text-xs text-error-600 flex items-center gap-1">
                        <AlertCircleIcon className="h-3 w-3" />
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                >
                  <PrinterIcon className="h-4 w-4" />
                  {t("assistance.downloadPdf")}
                </button>
                <p className="text-xs text-gray-500 self-center">
                  Opens your browser print dialog &mdash; choose &ldquo;Save as
                  PDF&rdquo;.
                </p>
              </div>
            </section>

            {/* Live A4 preview */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                {t("assistance.previewTitle")}
              </h2>
              <div className="bg-gray-200 rounded-lg p-4 md:p-6 overflow-auto max-h-[70vh] scrollbar-thin">
                <div
                  className="bg-white shadow-lg mx-auto w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 font-serif text-[13px] leading-relaxed text-gray-900"
                  dangerouslySetInnerHTML={{ __html: letterHTML }}
                />
              </div>
            </section>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <label
                htmlFor="guide-select"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
              >
                {t("assistance.selectGuide")}
              </label>
              <select
                id="guide-select"
                value={guideKey}
                onChange={(e) => setGuideKey(e.target.value as GuideKey)}
                className={cn(inputClass, "max-w-md font-semibold")}
              >
                <option value="indigency">
                  {t("assistance.barangayIndigency")}
                </option>
                <option value="no_income">{t("assistance.birNoIncome")}</option>
              </select>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t(activeGuide.titleKey)}
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-md border border-gray-200 p-4">
                  <MapPinIcon className="h-4 w-4 text-primary-500 mb-2" />
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    {t("assistance.whereToGet")}
                  </div>
                  <p className="text-sm text-gray-700">{bi(activeGuide.where)}</p>
                </div>
                <div className="rounded-md border border-gray-200 p-4">
                  <ClockIcon className="h-4 w-4 text-primary-500 mb-2" />
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    {t("assistance.timeline")}
                  </div>
                  <p className="text-sm text-gray-700">
                    {bi(activeGuide.timeline)}
                  </p>
                </div>
                <div className="rounded-md border border-gray-200 p-4">
                  <CircleDollarSignIcon className="h-4 w-4 text-primary-500 mb-2" />
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    {t("assistance.fees")}
                  </div>
                  <p className="text-sm text-gray-700">{bi(activeGuide.fees)}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <span>{t("assistance.progress")}</span>
                <span className="text-gray-900">{guideProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary-500 h-full transition-all duration-300"
                  style={{ width: `${guideProgress}%` }}
                />
              </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                <InfoIcon className="h-3.5 w-3.5" />
                {t("assistance.saveProgress")}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2Icon className="h-4 w-4 text-primary-500" />
                {t("assistance.requirements")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeGuide.requirements.map((req) => {
                  const isChecked = !!checked[req.id];
                  return (
                    <label
                      key={req.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-md border cursor-pointer select-none transition-colors",
                        isChecked
                          ? "bg-success-50 border-success-200"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecked(req.id)}
                        className="w-4 h-4 mt-0.5 accent-primary-500"
                      />
                      <span
                        className={cn(
                          "text-sm leading-relaxed",
                          isChecked
                            ? "text-success-800 line-through"
                            : "text-gray-700",
                        )}
                      >
                        {bi(req)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                {t("assistance.steps")}
              </h3>
              <div className="space-y-3">
                {activeGuide.steps.map((step, index) => {
                  const isChecked = !!checked[step.id];
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => toggleChecked(step.id)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 p-4 rounded-md border transition-colors select-none",
                        isChecked
                          ? "bg-success-50 border-success-200"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100",
                      )}
                    >
                      <CheckCircle2
                        className={cn(
                          "w-5 h-5 mt-0.5 shrink-0",
                          isChecked ? "text-success-500" : "text-gray-300",
                        )}
                      />
                      <span className="space-y-1">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Step {index + 1}
                        </span>
                        <span
                          className={cn(
                            "block text-sm font-bold",
                            isChecked ? "text-gray-400 line-through" : "text-gray-900",
                          )}
                        >
                          {locale === "tl" ? step.titleTl : step.titleEn}
                        </span>
                        <span className="block text-sm text-gray-600 leading-relaxed">
                          {bi(step)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
              <h3 className="text-base font-bold text-accent-800 flex items-center gap-2">
                <InfoIcon className="h-5 w-5 shrink-0" />
                {t("assistance.tips")}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-accent-900/80 leading-relaxed">
                {activeGuide.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>{bi(tip)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
