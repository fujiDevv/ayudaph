"use client";

import { AlertTriangle, Globe } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { footerSections } from "@/data/navigation";
import { useI18n } from "@/lib/i18n";
import { REPO_URL, SITE_URL } from "@/lib/site";

/**
 * Inline GitHub mark, drawn without an SVG `<title>`.
 *
 * The simple-icons component always emits `<title>GitHub</title>`. On routes
 * whose metadata is streamed, that `<title>` precedes the document title in
 * the DOM and becomes `document.title`, so the tab (and any no-JS consumer)
 * reads "GitHub" instead of the page name. The wrapping link already carries
 * `aria-label`, so the mark is decorative here.
 */
const GithubMark: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: REPO_URL,
    icon: <GithubMark className="h-5 w-5" />,
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
