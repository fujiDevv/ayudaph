"use client";

import {
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
  SearchIcon,
  StarIcon,
  TypeIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, useState } from "react";
import { mainNavigation } from "@/data/navigation";
import { LANGUAGES, useI18n, type Locale } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const normalizePath = (path: string) => path.replace(/\/$/, "");

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const { t, locale, setLocale } = useI18n();
  const { savedPrograms, isLargeText, toggleLargeText } = useStore();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setActiveMenu(null);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) =>
    setActiveMenu(activeMenu === label ? null : label);

  const isActiveRoute = (href: string) => {
    if (!href) return false;
    const normalizedPath = normalizePath(pathname || "");
    const normalizedHref = normalizePath(href);
    return (
      normalizedPath === normalizedHref ||
      (normalizedHref !== "/" &&
        normalizedPath.startsWith(normalizedHref + "/"))
    );
  };

  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleDropdownMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredDropdown(label);
  };

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
      closeTimeoutRef.current = null;
    }, 80);
  };

  return (
    <nav className="bg-white shadow-xs sticky top-0 z-50 overflow-x-clip print:hidden">
      {/* Top utility bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-center md:justify-end">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-xs md:justify-end">
            <Link
              href="/about"
              className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap"
            >
              {t("navbar.joinUs")}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center text-gray-800 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {t("navbar.about")}
            </Link>
            <a
              href="https://www.gov.ph"
              className="inline-flex items-center text-gray-800 hover:text-primary-600 transition-colors whitespace-nowrap"
              target="_blank"
              rel="noreferrer"
            >
              {t("navbar.officialPortal")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center text-gray-800 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {t("detail.contactUs")}
            </Link>
            <Link
              href="/hotlines"
              className="inline-flex items-center text-gray-800 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {t("nav.hotlines")}
            </Link>
            <div className="hidden md:block">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                aria-label="Select language"
                className="text-xs border border-gray-300 rounded-sm px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-hidden focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
              >
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-1 md:px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src="/logos/svg/BetterGov_Icon-Primary.svg"
                alt="Ayuda logo"
                className="h-12 w-12 mr-1 md:mr-3"
              />
              <div>
                <div className="text-black font-bold">{t("header.title")}</div>
                <div className="text-xs text-gray-800 max-w-[14rem] sm:max-w-none truncate">
                  {t("header.subtitle")}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center min-w-0 lg:space-x-1 xl:space-x-3 2xl:space-x-6 lg:leading-10">
            {mainNavigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              const groupLabel = t(`navbar.${item.groupKey}`);
              return (
                <div
                  key={item.groupKey}
                  className="relative group"
                  onMouseEnter={() => handleDropdownMouseEnter(groupLabel)}
                  onMouseLeave={(event) => {
                    if (!event.currentTarget.contains(document.activeElement)) {
                      handleDropdownMouseLeave();
                    }
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setHoveredDropdown(null);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setHoveredDropdown(null);
                      event.currentTarget.querySelector("button")?.focus();
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center font-medium transition-colors pb-1 border-b-2 whitespace-nowrap",
                        isActive
                          ? "text-primary-600 border-primary-600"
                          : "text-gray-700 hover:text-primary-600 border-transparent",
                      )}
                    >
                      <span className="lg:text-sm xl:text-base">{groupLabel}</span>
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        aria-label={`Toggle ${groupLabel} submenu`}
                        aria-expanded={hoveredDropdown === groupLabel}
                        aria-controls={`desktop-${item.groupKey}`}
                        onClick={() => {
                          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                          setHoveredDropdown((current) =>
                            current === groupLabel ? null : groupLabel,
                          );
                        }}
                        className="p-1 rounded focus-visible:outline-2 focus-visible:outline-primary-600"
                      >
                        <ChevronDownIcon
                          className={cn(
                            "ml-1 h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-primary-600"
                              : "text-gray-800 group-hover:text-primary-600",
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div
                      id={`desktop-${item.groupKey}`}
                      className={cn(
                        "absolute left-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black/5 transition-[opacity] duration-200 z-50 pt-2",
                        hoveredDropdown === groupLabel
                          ? "opacity-100 visible pointer-events-auto"
                          : "opacity-0 invisible pointer-events-none",
                      )}
                    >
                      <div className="py-1">
                        {item.children.map((child) => {
                          const childActive = isActiveRoute(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setHoveredDropdown(null)}
                              className={cn(
                                "text-left block px-4 py-2 text-sm",
                                childActive
                                  ? "bg-primary-500 text-primary-50 hover:bg-primary-500 hover:text-primary-50"
                                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-600",
                              )}
                            >
                              {t(`nav.${child.labelKey}`)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center shrink-0 lg:leading-10 gap-1">
            <Link
              href="/shortlist"
              className="flex items-center text-gray-700 hover:text-primary-600 font-semibold lg:text-sm xl:text-base transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              <StarIcon className="h-5 w-5 mr-2 shrink-0" />
              {t("nav.saved")}
              {savedPrograms.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary-500 text-white text-xs font-bold">
                  {savedPrograms.length}
                </span>
              )}
            </Link>
            <Link
              href="/search"
              className="flex items-center text-gray-700 hover:text-primary-600 font-semibold lg:text-base xl:text-lg transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              <SearchIcon className="h-5 w-5 mr-2 shrink-0" />
              {t("filters.search")}
            </Link>
            <button
              type="button"
              onClick={toggleLargeText}
              aria-pressed={isLargeText}
              aria-label={t("nav.largeText")}
              title={t("nav.largeText")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isLargeText
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50",
              )}
            >
              <TypeIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-1">
            <Link
              href="/shortlist"
              className="relative p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100"
              aria-label={t("nav.saved")}
            >
              <StarIcon className="h-6 w-6" />
              {savedPrograms.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary-500 text-white text-[10px] font-bold">
                  {savedPrograms.length}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              aria-label="Toggle main menu"
              aria-expanded={isOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", isOpen ? "block" : "hidden")}>
        <div className="container mx-auto px-2 pt-2 pb-4 space-y-1 border-t border-gray-200 bg-white">
          {mainNavigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            const groupLabel = t(`navbar.${item.groupKey}`);
            return (
              <div key={item.groupKey}>
                <div
                  className={cn(
                    "w-full flex justify-between items-center transition-colors",
                    isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary-500",
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex-1 px-4 py-2 text-base font-medium"
                  >
                    {groupLabel}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(groupLabel)}
                      aria-expanded={activeMenu === groupLabel}
                      aria-label={`Toggle ${groupLabel} submenu`}
                      className="px-4 py-2 shrink-0"
                    >
                      <ChevronDownIcon
                        className={cn(
                          "h-5 w-5 transition-transform",
                          activeMenu === groupLabel && "transform rotate-180",
                          isActive && "text-primary-600",
                        )}
                      />
                    </button>
                  )}
                </div>
                {item.children && activeMenu === groupLabel && (
                  <div className="pl-6 py-2 space-y-1 bg-gray-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500"
                      >
                        {t(`nav.${child.labelKey}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/about"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-semibold text-primary-600 hover:bg-primary-50 hover:text-primary-700"
          >
            {t("navbar.joinUs")}
          </Link>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t("detail.contactUs")}
          </Link>
          <Link
            href="/search"
            onClick={closeMenu}
            className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          >
            <SearchIcon className="h-5 w-5 mr-2" />
            {t("filters.search")}
          </Link>
          <button
            type="button"
            onClick={() => {
              toggleLargeText();
              closeMenu();
            }}
            className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            <TypeIcon className="h-5 w-5 mr-2" />
            {isLargeText ? "Normal text" : t("nav.largeText")}
          </button>
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center">
              <GlobeIcon className="h-5 w-5 text-gray-800 mr-2" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                aria-label="Select language"
                className="text-sm border border-gray-300 rounded-sm px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-hidden focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
              >
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
