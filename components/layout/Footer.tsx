"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { AlertTriangle, Globe } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { footerSections } from "@/data/navigation";
import { useI18n } from "@/lib/i18n";
import { REPO_URL, SITE_URL } from "@/lib/site";

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: REPO_URL,
    icon: <SiGithub className="h-5 w-5" />,
  },
  {
    label: "Website",
    href: SITE_URL,
    icon: <Globe className="h-5 w-5" />,
  },
];

const Footer: FC = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-white print:hidden">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logos/svg/BetterGov_Icon-White.svg"
                alt="Ayuda logo"
                className="h-12 w-12 mr-3"
              />
              <div>
                <div className="font-bold">{t("header.title")}</div>
                <div className="text-xs text-gray-400">{t("header.subtitle")}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{t("footer.desc")}</p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="text-lg font-semibold mb-4">
                {t(`navbar.${section.titleKey}`)}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {t(`nav.${link.labelKey}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4 mb-8 mt-16 text-xs leading-relaxed text-gray-400">
          <p className="flex items-center gap-1.5 font-semibold text-gray-300 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            {t("footer.disclaimerTitle")}
          </p>
          <p>{t("footer.disclaimerDesc")}</p>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t("footer.credit")}
            </p>
            <div className="flex space-x-6">
              <a
                href={REPO_URL}
                className="text-gray-400 hover:text-white text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("about.contribButton")}
              </a>
              <Link
                href="/sitemap"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t("nav.sitemap")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
