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
import { programs } from "@/data/constants";
import type { Program } from "./types";

const SAVED_KEY = "ayuda_saved";
const CHECKED_KEY = "ayuda_checked_reqs";
const LARGE_TEXT_KEY = "ayuda_large_text";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface StoreContextValue {
  savedPrograms: string[];
  isSaved: (id: string) => boolean;
  toggleSaveProgram: (id: string) => void;

  checkedRequirements: Record<string, string[]>;
  isRequirementChecked: (programId: string, requirement: string) => boolean;
  toggleRequirement: (programId: string, requirement: string) => void;
  getCheckedCount: (programId: string) => number;
  getPreparedPercent: (program: Program) => number;

  shortlistedPrograms: Program[];

  isLargeText: boolean;
  toggleLargeText: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);
  const [checkedRequirements, setCheckedRequirements] = useState<
    Record<string, string[]>
  >({});
  const [isLargeText, setIsLargeText] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted state after mount so SSR markup stays stable.
  useEffect(() => {
    setSavedPrograms(readJSON<string[]>(SAVED_KEY, []));
    setCheckedRequirements(readJSON<Record<string, string[]>>(CHECKED_KEY, {}));
    setIsLargeText(readJSON<boolean>(LARGE_TEXT_KEY, false));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(savedPrograms));
  }, [savedPrograms, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CHECKED_KEY, JSON.stringify(checkedRequirements));
  }, [checkedRequirements, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LARGE_TEXT_KEY, JSON.stringify(isLargeText));
    document.documentElement.classList.toggle("large-text", isLargeText);
  }, [isLargeText, hydrated]);

  const isSaved = useCallback(
    (id: string) => savedPrograms.includes(id),
    [savedPrograms],
  );

  const toggleSaveProgram = useCallback((id: string) => {
    setSavedPrograms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const toggleRequirement = useCallback((programId: string, requirement: string) => {
    setCheckedRequirements((prev) => {
      const list = prev[programId] ?? [];
      const nextList = list.includes(requirement)
        ? list.filter((item) => item !== requirement)
        : [...list, requirement];
      const next = { ...prev };
      if (nextList.length === 0) {
        delete next[programId];
      } else {
        next[programId] = nextList;
      }
      return next;
    });
  }, []);

  const isRequirementChecked = useCallback(
    (programId: string, requirement: string) =>
      (checkedRequirements[programId] ?? []).includes(requirement),
    [checkedRequirements],
  );

  const getCheckedCount = useCallback(
    (programId: string) => (checkedRequirements[programId] ?? []).length,
    [checkedRequirements],
  );

  const getPreparedPercent = useCallback(
    (program: Program) => {
      const total = program.requirements.length;
      if (total === 0) return 0;
      return Math.round((getCheckedCount(program.id) / total) * 100);
    },
    [getCheckedCount],
  );

  const shortlistedPrograms = useMemo(
    () => programs.filter((program) => savedPrograms.includes(program.id)),
    [savedPrograms],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      savedPrograms,
      isSaved,
      toggleSaveProgram,
      checkedRequirements,
      isRequirementChecked,
      toggleRequirement,
      getCheckedCount,
      getPreparedPercent,
      shortlistedPrograms,
      isLargeText,
      toggleLargeText: () => setIsLargeText((prev) => !prev),
    }),
    [
      savedPrograms,
      isSaved,
      toggleSaveProgram,
      checkedRequirements,
      isRequirementChecked,
      toggleRequirement,
      getCheckedCount,
      getPreparedPercent,
      shortlistedPrograms,
      isLargeText,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
