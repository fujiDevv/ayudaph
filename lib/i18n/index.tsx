"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "./en.json";
import tl from "./tl.json";

export type Locale = "en" | "tl";

type Messages = Record<string, unknown>;

const MESSAGES: Record<Locale, Messages> = {
  en: en as Messages,
  tl: tl as Messages,
};

export const LANGUAGES: Record<Locale, { nativeName: string }> = {
  en: { nativeName: "English" },
  tl: { nativeName: "Tagalog" },
};

const STORAGE_KEY = "ayuda_locale";

function resolve(source: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a dot-path key, with fallback to English and optional vars. */
  t: (path: string, vars?: Record<string, string | number>) => string;
  /** Resolve a dot-path to an array of strings (e.g. program step lists). */
  tm: (path: string) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Restore the visitor's saved language on mount.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "tl") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "tl" ? "tl" : "en";
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (path: string, vars?: Record<string, string | number>) => {
      const localized = resolve(MESSAGES[locale], path);
      const fallback = resolve(MESSAGES.en, path);
      const value = localized ?? fallback;
      if (typeof value === "string") return interpolate(value, vars);
      if (value == null) return path;
      return String(value);
    };

    const tm = (path: string) => {
      const localized = resolve(MESSAGES[locale], path);
      const fallback = resolve(MESSAGES.en, path);
      const value = localized ?? fallback;
      return Array.isArray(value) ? (value as string[]) : [];
    };

    return { locale, setLocale, t, tm };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
