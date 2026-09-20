export type GuideKey = "indigency" | "no_income";

interface Bilingual {
  en: string;
  tl: string;
}

interface BilingualItem {
  id: string;
  en: string;
  tl: string;
  titleEn?: string;
  titleTl?: string;
}

export interface Guide {
  key: GuideKey;
  titleKey: string;
  where: Bilingual;
  timeline: Bilingual;
  fees: Bilingual;
  requirements: BilingualItem[];
  steps: (BilingualItem & { titleEn: string; titleTl: string })[];
  tips: Bilingual[];
}

export const guides: Guide[] = [
  {
    key: "indigency",
    titleKey: "assistance.barangayIndigency",
    where: {
      en: "Your local Barangay Hall (Must have at least 6 months of residency)",
      tl: "Sa Barangay Hall ng iyong nasasakupan (Dapat residente nang kahit 6 na buwan)",
    },
    timeline: {
      en: "Within the day (usually 10 to 30 minutes)",
      tl: "Sa loob ng araw na iyon (karaniwang 10 hanggang 30 minuto)",
    },
    fees: {
      en: "FREE (Under RA 11261 for first-time jobseekers, or waived for indigent welfare programs in most barangays. Otherwise, a minimal processing fee of ₱20 to ₱50 may apply).",
      tl: "LIBRE (Sa ilalim ng RA 11261 para sa naghahanap ng unang trabaho, o libre para sa may krisis sa karamihan ng barangay. Kung hindi, minimal na singil na ₱20 hanggang ₱50).",
    },
    requirements: [
      {
        id: "ind_req1",
        en: "At least 1 Valid Government ID proving residence",
        tl: "Kahit 1 Valid Government ID na nagpapatunay ng iyong address",
      },
      {
        id: "ind_req2",
        en: "Proof of Residency (e.g. Utility bill under applicant name, land contract, or certification from landlord)",
        tl: "Patunay ng Pagkatira (hal. Bill ng kuryente/tubig sa pangalan mo, o sertipikasyon mula sa may-ari ng bahay)",
      },
      {
        id: "ind_req3",
        en: "Community Tax Certificate (Cedula) - usually purchased at the Barangay Hall for ₱5 to ₱30",
        tl: "Cedula (Community Tax Certificate) - karaniwang binibili sa Barangay Hall sa halagang ₱5 hanggang ₱30",
      },
      {
        id: "ind_req4",
        en: "First Time Jobseeker Oath (Optional, if applying for jobs to waive all fees)",
        tl: "Panunumpa bilang First Time Jobseeker (Opsyonal, kung gagamitin sa paghahanap ng trabaho upang maging libre)",
      },
    ],
    steps: [
      {
        id: "ind_step1",
        titleEn: "Visit the Barangay Hall",
        titleTl: "Pumunta sa Barangay Hall",
        en: "Go to the Barangay Hall of your residence. Bring your own black ballpoint pen and photocopies of your valid ID.",
        tl: "Magtungo sa Barangay Hall ng inyong komunidad. Magdala ng sariling itim na ballpen at kopya ng iyong valid ID.",
      },
      {
        id: "ind_step2",
        titleEn: "Secure a Cedula",
        titleTl: "Kumuha ng Cedula",
        en: "If you do not have a Cedula for the current calendar year, request one at the cashier/assessment desk. Pay the minor fee based on your income (or declare no income for minimal fee).",
        tl: "Kung wala ka pang Cedula para sa kasalukuyang taon, kumuha muna sa cashier. Magbayad ng kaunting halaga base sa iyong kita (sabihing walang trabaho kung walang kita).",
      },
      {
        id: "ind_step3",
        titleEn: "Fill out the Request Form",
        titleTl: "Punan ang Request Form",
        en: 'Ask the desk officer for a Request Form for Certificate of Indigency. Clearly write the purpose of your application (e.g., "DSWD AICS Aid", "BIR Tax Exemption", "Hospitalization Malasakit").',
        tl: 'Humingi ng Request Form para sa Certificate of Indigency. Isulat nang malinaw ang layunin (hal., "Tulong mula sa DSWD", "BIR Tax Exemption", "Malasakit Center sa Ospital").',
      },
      {
        id: "ind_step4",
        titleEn: "Assessment and Verification",
        titleTl: "Pagsusuri at Pagpapatunay",
        en: "The barangay secretary will check if you are registered in their local resident listing. They may ask brief questions about your housing status or job situation.",
        tl: "Susuriin ng Barangay Secretary kung ikaw ay nakalista bilang residente sa kanilang barangay record. Maaari silang magtanong ukol sa iyong trabaho.",
      },
      {
        id: "ind_step5",
        titleEn: "Document Release",
        titleTl: "Paglabas ng Dokumento",
        en: "Wait for the Barangay Chairman or authorized officer to sign the certificate. Once stamped with the official seal, it will be released to you. Double-check spelling before leaving.",
        tl: "Maghintay na mapirmahan ng Barangay Chairman ang iyong dokumento. Kapag naselyohan na, ibibigay na ito sa iyo. Suriin ang spelling bago umalis.",
      },
    ],
    tips: [
      {
        en: 'Always request the document for "Welfare Assistance" or "Medical Aid" so they can waive the fees entirely.',
        tl: 'Palaging sabihing gagamitin sa "Tulong Medikal" o "Crisis Assistance" upang alisin ang anumang bayarin sa barangay.',
      },
      {
        en: "If you are applying for jobs, present a First-Time Jobseeker certification to invoke Republic Act 11261 for 100% free release.",
        tl: "Kung ikaw ay mag-aapply ng trabaho sa unang pagkakataon, gamitin ang Barangay Certification para sa First-Time Jobseeker sa ilalim ng RA 11261 para maging libre.",
      },
      {
        en: "Bring extra photocopies of your IDs. Many government counters will require them, and internet cafes charge a premium for xerox copies.",
        tl: "Magdala ng ekstrang photocopy ng iyong mga ID upang hindi na magbayad ng mahal sa mga xerox machine sa labas.",
      },
    ],
  },
  {
    key: "no_income",
    titleKey: "assistance.birNoIncome",
    where: {
      en: "BIR Revenue District Office (RDO) that holds jurisdiction over your municipality of residence.",
      tl: "BIR Revenue District Office (RDO) na sumasakop sa iyong munisipalidad o lungsod.",
    },
    timeline: {
      en: "Within the day (usually 1 to 2 hours, depending on RDO queue lines)",
      tl: "Sa loob ng araw na iyon (karaniwang 1 hanggang 2 oras depende sa haba ng pila)",
    },
    fees: {
      en: "FREE or minor Documentary Stamp Tax (approx. ₱30).",
      tl: "LIBRE o kaunting Documentary Stamp Tax (humigit-kumulang ₱30).",
    },
    requirements: [
      {
        id: "inc_req1",
        en: "Barangay Certificate of Indigency (Prerequisite! Must specify BIR as the purpose)",
        tl: "Barangay Certificate of Indigency (Unang kailangan! Dapat BIR ang nakalagay na layunin)",
      },
      {
        id: "inc_req2",
        en: "Notarized Affidavit of Low Income or No Income (You can generate this in the Document Generator tab!)",
        tl: "Notarized Affidavit of Low Income o No Income (Maaari mong gawin ito sa tab ng Paggawa ng Dokumento!)",
      },
      {
        id: "inc_req3",
        en: "Photocopy of 2 Valid Government-Issued IDs (e.g. UMID, Voters ID, PhilHealth, Barangay ID)",
        tl: "Photocopy ng 2 Valid Government-Issued ID (hal. UMID, Voters ID, PhilHealth, Barangay ID)",
      },
      {
        id: "inc_req4",
        en: "Completed BIR Form 1917 (Application for Tax Exemption Certificate)",
        tl: "Pinalagdaang BIR Form 1917 (Application for Tax Exemption Certificate)",
      },
    ],
    steps: [
      {
        id: "inc_step1",
        titleEn: "Acquire Barangay Certificate of Indigency",
        titleTl: "Kumuha muna ng Barangay Certificate of Indigency",
        en: 'Get your Barangay Indigency Certificate first. Ensure the purpose listed is "For BIR Certificate of No Income" or "For Tax Exemption Certificate".',
        tl: "Kumuha muna ng Barangay Certificate of Indigency. Tiyaking ang nakalagay na purpose ay para sa BIR.",
      },
      {
        id: "inc_step2",
        titleEn: "Prepare Affidavit of Low Income",
        titleTl: "Ihanda ang Affidavit of Low Income",
        en: "Fill out and print the Affidavit of Low Income using our generator. Have it notarized by a notary public (often free/discounted for indigents at Public Attorney's Office - PAO) or signed by your Barangay Captain.",
        tl: "Ihanda at i-print ang Affidavit of Low Income. Ipa-notaryo ito sa pinakamalapit na notaryo o magtanong sa PAO para sa libreng serbisyo.",
      },
      {
        id: "inc_step3",
        titleEn: "Locate your jurisdiction BIR RDO",
        titleTl: "Hanapin ang iyong nakatalagang BIR RDO",
        en: "Find out which BIR Revenue District Office (RDO) covers your hometown. You must apply at this specific branch.",
        tl: "Alamin kung aling tanggapan ng BIR RDO ang sumasaklaw sa inyong lugar. Dapat sa sangay na iyon ka mag-apply.",
      },
      {
        id: "inc_step4",
        titleEn: "Submit and File at BIR RDO",
        titleTl: "Isumite ang mga papeles sa BIR RDO",
        en: "Go to the taxpayer assistance unit at the RDO. Ask for BIR Form 1917, fill it out, and submit all requirements (Indigency, Affidavit, ID copies).",
        tl: "Magtungo sa taxpayer assistance unit sa RDO. Humingi ng BIR Form 1917, punan ito, at ipasa ang mga dokumento (Indigency, Affidavit, ID copies).",
      },
      {
        id: "inc_step5",
        titleEn: "Receive Certificate of Tax Exemption",
        titleTl: "Tanggapin ang Tax Exemption Certificate",
        en: "Wait for the officer to verify that you have no record of tax filing. Once cleared, the Certificate of Tax Exemption (No Income) will be signed and handed to you.",
        tl: "Maghintay na ma-verify ng opisyal na wala kang rekord ng pagbabayad ng buwis. Kapag okay na, ibibigay na ang Certificate of Tax Exemption (No Income).",
      },
    ],
    tips: [
      {
        en: "If the BIR RDO is far, check if your local municipal social welfare office (MSWD) will accept just the Barangay Certificate of Indigency as sufficient proof of low income. Many programs are lenient during emergencies.",
        tl: "Kung malayo ang tanggapan ng BIR RDO, itanong sa DSWD o MSWD kung tatanggapin na muna ang Barangay Certificate of Indigency bilang sapat na patunay. Maraming programa ang pumapayag dito sa panahon ng krisis.",
      },
      {
        en: "To avoid notary fees, look for the Public Attorney's Office (PAO) near the municipal hall, which offers free notary services for qualified indigent clients.",
        tl: "Upang makaiwas sa bayad sa notaryo, maghanap ng tanggapan ng Public Attorney's Office (PAO) na malapit sa munisipyo, na nagbibigay ng libreng notaryo para sa mga indigent.",
      },
      {
        en: "Ensure you bring your own black ink pen as writing instruments are rarely shared at government security counters.",
        tl: "Magdala ng sariling itim na bolpen dahil madalas ay walang mahihiramang panulat sa mga counter ng gobyerno.",
      },
    ],
  },
];
