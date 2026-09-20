"use client";

import { AlertTriangleIcon, MailIcon, PhoneIcon, PhoneCallIcon } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { hotlines } from "@/data/constants";
import { useI18n } from "@/lib/i18n";

function getDialableNumber(text: string) {
  let clean = text.split(/\s+(?:to|or)\s+/i)[0].trim();
  clean = clean
    .replace(/^(Smart|Globe|Toll-Free|Hotline|Toll-Free Hotline)[:\s-]+\s*/i, "")
    .trim();
  clean = clean.replace(/\(.*?\)/g, "").trim();
  return clean.replace(/[^\d+*]/g, "");
}

export default function HotlinesList() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t("hotlines.title")}
        subtitle={t("hotlines.desc")}
        crumbs={[{ label: t("nav.hotlines") }]}
        icon={<PhoneCallIcon className="h-6 w-6" />}
      />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotlines.map((contact) => (
            <div
              key={contact.agency}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
            >
              <div>
                <h2 className="font-bold text-base text-gray-900 leading-snug">
                  {contact.agency}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {contact.purpose}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-start gap-2 text-xs font-semibold">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1.5 grow">
                    {contact.numbers.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${getDialableNumber(phone)}`}
                        className="text-primary-600 hover:underline break-all leading-normal"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-gray-500">
                  <MailIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1.5 grow">
                    {contact.emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="hover:underline text-gray-600 break-all leading-normal"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary-50 border border-primary-200 p-5 rounded-lg mt-8 flex items-start gap-4">
          <AlertTriangleIcon className="w-8 h-8 text-primary-600 shrink-0" />
          <div>
            <h3 className="font-bold text-primary-800 text-sm">
              {t("hotlines.noticeTitle")}
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed mt-1">
              {t("hotlines.noticeDesc")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
