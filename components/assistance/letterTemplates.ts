export type DocType = "authorization" | "low_income" | "request";
export type LocaleCode = "en" | "tl";

export interface LetterForm {
  date: string;
  applicantName: string;
  applicantAddress: string;
  repName: string;
  repAddress: string;
  relationship: string;
  purposeAuth: string;
  explanationAuth: string;
  monthlyIncome: string;
  livelihood: string;
  dependents: string;
  purposeAffidavit: string;
  governmentId: string;
  recipient: string;
  office: string;
  officeAddress: string;
  patientName: string;
  relationshipToPatient: string;
  purposeRequest: string;
  explanationRequest: string;
}

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Fall back to a bracketed placeholder when a field is still blank. */
function fallback(value: string, label: string, t: (k: string) => string) {
  return value.trim() ? esc(value.trim()) : `[${t(`assistance.${label}`)}]`;
}

export function buildLetterHTML(
  docType: DocType,
  locale: LocaleCode,
  form: LetterForm,
  t: (key: string) => string,
): string {
  const isEn = locale === "en";
  const appName = fallback(form.applicantName, "applicantName", t);
  const appAddr = fallback(form.applicantAddress, "applicantAddress", t);
  const dateStr = form.date
    ? new Date(form.date).toLocaleDateString(locale === "tl" ? "tl-PH" : "en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : `[${t("assistance.date")}]`;

  if (docType === "authorization") {
    const repName = fallback(form.repName, "repName", t);
    const repAddr = fallback(form.repAddress, "repAddress", t);
    const rel = fallback(form.relationship, "relationship", t);
    const purp = fallback(form.purposeAuth, "purpose", t);
    const exp = fallback(form.explanationAuth, "explanation", t);

    const labels = isEn
      ? {
          to: "TO WHOM IT MAY CONCERN",
          greeting: "Dear Sir/Madam,",
          subject: "LETTER OF AUTHORIZATION",
          p1: `I, <strong>${appName}</strong>, residing at <strong>${appAddr}</strong>, hereby authorize <strong>${repName}</strong>, my <strong>${rel}</strong> who resides at <strong>${repAddr}</strong>, to act as my official representative to <strong>${purp}</strong> on my behalf.`,
          p2: `I am granting this authority because I am unable to perform this task in person due to the following reason: <strong>${exp}</strong>.`,
          p3: `Please accept this letter along with a copy of my valid identification card and my representative's identification card for verification purposes.`,
          p4: `Thank you for your cooperation and understanding.`,
          valediction: "Sincerely,",
          grantorLabel: "Authorizing Person / Grantor",
          repLabel: "Authorized Representative",
        }
      : {
          to: "SA KINAUUKULAN,",
          greeting: "Mahal na Ginoo / Ginang,",
          subject: "SULAT NG PAGPAPAHINTULOT (AUTHORIZATION LETTER)",
          p1: `Ako si <strong>${appName}</strong>, na naninirahan sa <strong>${appAddr}</strong>, ay nagbibigay-pahintulot kay <strong>${repName}</strong>, na aking <strong>${rel}</strong> at naninirahan sa <strong>${repAddr}</strong>, na maging aking opisyal na kinatawan upang <strong>${purp}</strong> para sa akin.`,
          p2: `Iginagawad ko ang pahintulot na ito dahil hindi ko ito magagawa nang personal dahil sa sumusunod na dahilan: <strong>${exp}</strong>.`,
          p3: `Sana ay tanggapin ninyo ang sulat na ito kasama ang photocopy ng aking valid ID at valid ID ng aking kinatawan para sa pagpapatunay.`,
          p4: `Maraming salamat po sa inyong tulong at pag-unawa.`,
          valediction: "Gumagalang,",
          grantorLabel: "Nagpapahintulot",
          repLabel: "Kinatawan",
        };

    return `
      <p class="text-right font-medium">${dateStr}</p>
      <p class="font-bold mt-4">${labels.to}</p>
      <p class="font-bold border-b border-black pb-1 text-center tracking-wider mt-4">${labels.subject}</p>
      <p class="mt-4">${labels.greeting}</p>
      <p class="indent-8 text-justify leading-relaxed mt-3">${labels.p1}</p>
      <p class="indent-8 text-justify leading-relaxed mt-3">${labels.p2}</p>
      <p class="indent-8 text-justify leading-relaxed mt-3">${labels.p3}</p>
      <p class="mt-3">${labels.p4}</p>
      <div class="pt-10 flex justify-between gap-8">
        <div class="w-1/2">
          <p>${labels.valediction}</p>
          <div class="mt-12 border-t border-black pt-1 text-center">
            <p class="font-bold uppercase">${appName}</p>
            <p class="text-xs text-gray-500 font-medium">${labels.grantorLabel}</p>
          </div>
        </div>
        <div class="w-1/2 flex flex-col justify-end">
          <div class="mt-12 border-t border-black pt-1 text-center">
            <p class="font-bold uppercase">${repName}</p>
            <p class="text-xs text-gray-500 font-medium">${labels.repLabel}</p>
          </div>
        </div>
      </div>
    `;
  }

  if (docType === "low_income") {
    const income = fallback(form.monthlyIncome, "monthlyIncome", t);
    const livelihood = fallback(form.livelihood, "livelihood", t);
    const dependents = esc(form.dependents || "1");
    const purpose = fallback(form.purposeAffidavit, "purpose", t);
    const govId = form.governmentId.trim()
      ? esc(form.governmentId.trim())
      : "____________________";

    if (isEn) {
      return `
        <div class="text-center font-bold uppercase space-y-1">
          <p>REPUBLIC OF THE PHILIPPINES</p>
          <p>CITY/MUNICIPALITY OF ____________________ ) S.S.</p>
          <p class="pt-4 border-b-2 border-double border-black inline-block px-4">AFFIDAVIT OF LOW INCOME</p>
        </div>
        <p class="pt-6">
          I, <strong>${appName}</strong>, of legal age, Filipino, residing at <strong>${appAddr}</strong>, after having been duly sworn to in accordance with law, hereby depose and state that:
        </p>
        <ol class="list-decimal pl-6 space-y-2 text-justify mt-3">
          <li>I am a resident of the aforementioned address and belong to a low-income family;</li>
          <li>My household has an average monthly income of only <strong>${income}</strong>, derived primarily from my work/livelihood as a <strong>${livelihood}</strong>;</li>
          <li>I have <strong>${dependents}</strong> dependent(s) who rely on me for their daily sustenance, nutrition, and educational needs;</li>
          <li>Due to our limited financial capacity, we struggle to make ends meet and cope with special administrative or medical needs;</li>
          <li>I am executing this affidavit to attest to the truth of the foregoing facts and for the purpose of applying for <strong>${purpose}</strong>, and for whatever legal purpose this may serve.</li>
        </ol>
        <p class="pt-4">IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of ________________, 20___ at ________________________, Philippines.</p>
        <div class="pt-8 flex justify-end">
          <div class="w-1/2 text-center">
            <div class="mt-12 border-t border-black pt-1">
              <p class="font-bold uppercase">${appName}</p>
              <p class="text-xs text-gray-500 font-medium">Affiant / Declarant</p>
            </div>
          </div>
        </div>
        <div class="mt-10 border-t border-dashed pt-4 text-xs space-y-2">
          <p class="font-bold text-center">JURAT (NOTARY PUBLIC AREA)</p>
          <p class="text-justify leading-relaxed">
            SUBSCRIBED AND SWORN to before me this _____ day of _______________, 20___ at ________________________, Philippines, affiant exhibiting to me their Government Issued ID card: <strong>${govId}</strong>.
          </p>
          <div class="flex justify-between pt-4 text-[10px]">
            <div>
              <p>Doc. No. ______;</p>
              <p>Page. No. ______;</p>
              <p>Book. No. ______;</p>
              <p>Series of 20____.</p>
            </div>
            <div class="w-48 text-center border-t border-black mt-8 pt-1">
              <p>Notary Public</p>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="text-center font-bold uppercase space-y-1">
        <p>REPUBLIKA NG PILIPINAS</p>
        <p>LUNGSOD/MUNISIPYO NG ____________________ ) S.S.</p>
        <p class="pt-4 border-b-2 border-double border-black inline-block px-4">SINUMPAANG SALAYSAY NG PAGIGING KAPOS SA KITA</p>
      </div>
      <p class="pt-6">
        Ako si <strong>${appName}</strong>, sapat ang gulang, Pilipino, at kasalukuyang naninirahan sa <strong>${appAddr}</strong>, matapos makapanumpa nang naaayon sa batas, ay malayang nagsasalaysay ng mga sumusunod:
      </p>
      <ol class="list-decimal pl-6 space-y-2 text-justify mt-3">
        <li>Ako ay residente sa nabanggit na tirahan at kabilang sa isang pamilyang may mababang kita;</li>
        <li>Ang aming pamilya ay may tinatayang buwanang kita na <strong>${income}</strong>, na nagmumula sa aking paghahanapbuhay bilang <strong>${livelihood}</strong>;</li>
        <li>Mayroon akong <strong>${dependents}</strong> dependent(s) na umaasa sa aking pang-araw-araw na suporta para sa pagkain, kalusugan, at pag-aaral;</li>
        <li>Dahil sa aming limitadong kakayahang pinansyal, labis kaming nahihirapan na tustusan ang iba pang mga biglaang gastusin;</li>
        <li>Ginagawa ko ang salaysay na ito upang patunayan ang katotohanan ng mga nakasaad sa itaas at para sa layunin ng aking aplikasyon sa <strong>${purpose}</strong>, at para sa iba pang legal na layunin.</li>
      </ol>
      <p class="pt-4">BILANG PATUNAY, nilagdaan ko ito ngayong ika-_____ ng ________________, 20___ sa ________________________, Pilipinas.</p>
      <div class="pt-8 flex justify-end">
        <div class="w-1/2 text-center">
          <div class="mt-12 border-t border-black pt-1">
            <p class="font-bold uppercase">${appName}</p>
            <p class="text-xs text-gray-500 font-medium">Nagsasalaysay (Affiant)</p>
          </div>
        </div>
      </div>
      <div class="mt-10 border-t border-dashed pt-4 text-xs space-y-2">
        <p class="font-bold text-center">JURAT (NOTARY PUBLIC AREA)</p>
        <p class="text-justify leading-relaxed">
          NILAGDAAN AT SINUMPAAN sa harap ko ngayong ika-_____ ng _______________, 20___ sa ________________________, Pilipinas, matapos ipakita ng nagsasalaysay ang kanyang Government ID card: <strong>${govId}</strong>.
        </p>
        <div class="flex justify-between pt-4 text-[10px]">
          <div>
            <p>Doc. No. ______;</p>
            <p>Page. No. ______;</p>
            <p>Book. No. ______;</p>
            <p>Series of 20____.</p>
          </div>
          <div class="w-48 text-center border-t border-black mt-8 pt-1">
            <p>Notary Public</p>
          </div>
        </div>
      </div>
    `;
  }

  // Request letter
  const recipient = fallback(form.recipient, "recipient", t);
  const office = fallback(form.office, "office", t);
  const officeAddress = fallback(form.officeAddress, "officeAddress", t);
  const patientName = form.patientName.trim();
  const relToPatient = form.relationshipToPatient.trim();
  const purpose = fallback(form.purposeRequest, "purpose", t);
  const explanation = fallback(form.explanationRequest, "explanation", t);

  const subject = patientName
    ? isEn
      ? `REQUEST FOR ASSISTANCE FOR MY ${esc(relToPatient.toUpperCase())}, ${esc(patientName.toUpperCase())}`
      : `HILING PARA SA TULONG SA AKING ${esc(relToPatient.toUpperCase())} NA SI ${esc(patientName.toUpperCase())}`
    : isEn
      ? `REQUEST FOR FINANCIAL/MEDICAL ASSISTANCE`
      : `HILING PARA SA TULONG PINANSYAL / MEDIKAL`;

  const p1 = isEn
    ? `I am writing this letter to respectfully request financial and welfare support from your good office. I am <strong>${appName}</strong>, residing at <strong>${appAddr}</strong>.`
    : `Magalang akong sumusulat sa inyong tanggapan upang humingi ng tulong pinansyal at suporta. Ako si <strong>${appName}</strong>, na naninirahan sa <strong>${appAddr}</strong>.`;
  const p2 = isEn
    ? `I am seeking assistance for <strong>${purpose}</strong>${patientName ? ` on behalf of my ${esc(relToPatient)}, <strong>${esc(patientName)}</strong>` : ""}.`
    : `Humihingi ako ng tulong para sa <strong>${purpose}</strong>${patientName ? ` para sa aking ${esc(relToPatient)} na si <strong>${esc(patientName)}</strong>` : ""}.`;
  const p3 = isEn
    ? `Our household is currently facing deep financial difficulties due to the following circumstances: <strong>${explanation}</strong>. We are struggling to secure the full amount to cover these essential expenses.`
    : `Sa kasalukuyan, ang aming pamilya ay nakakaranas ng matinding kahirapang pinansyal dahil sa sumusunod na sitwasyon: <strong>${explanation}</strong>. Kami po ay nahihirapang mangalap ng sapat na pondo para tustusan ang mga gastusing ito.`;
  const p4 = isEn
    ? `Any assistance that your honorable office can extend to us will be deeply appreciated and will provide major relief to our family in this trying time.`
    : `Ang anumang tulong na inyong maipapaabot sa aming pamilya ay tatanawin naming malaking utang na loob at magdudulot ng malaking kaginhawaan sa amin sa gitna ng pagsubok na ito.`;
  const p5 = isEn
    ? `Thank you very much, and I hope for your favorable consideration of this request.`
    : `Maraming salamat po, at umaasa ako sa inyong mabuting pagsasaalang-alang sa hiling na ito.`;

  return `
    <p class="text-right font-medium">${dateStr}</p>
    <div class="mt-4">
      <p class="font-bold uppercase">${recipient}</p>
      <p>${office}</p>
      <p>${officeAddress}</p>
    </div>
    <p class="font-bold mt-5 border-b border-black pb-0.5 inline-block">${isEn ? "SUBJECT:" : "PAKSA:"} ${subject}</p>
    <p class="mt-4">${isEn ? "Dear Sir/Madam," : "Mahal na Ginoo / Ginang,"}</p>
    <p class="indent-8 text-justify leading-relaxed mt-3">${p1}</p>
    <p class="indent-8 text-justify leading-relaxed mt-3">${p2}</p>
    <p class="indent-8 text-justify leading-relaxed mt-3">${p3}</p>
    <p class="indent-8 text-justify leading-relaxed mt-3">${p4}</p>
    <p class="indent-8 text-justify leading-relaxed mt-3">${p5}</p>
    <div class="pt-10">
      <p>${isEn ? "Respectfully yours," : "Tapat na sumasainyo,"}</p>
      <div class="mt-12 border-t border-black pt-1 w-64">
        <p class="font-bold uppercase">${appName}</p>
        <p class="text-xs text-gray-500 font-medium">${isEn ? "Applicant" : "Aplikante"}</p>
      </div>
    </div>
  `;
}
