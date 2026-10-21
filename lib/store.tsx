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
import { readStoredJSON, writeStoredJSON } from "./storage";
import { migrateRequirements, normalizeSavedPrograms } from "./requirements";

const SAVED_KEY = "ayuda_saved";
const CHECKED_KEY = "ayuda_checked_reqs";
const LARGE_TEXT_KEY = "ayuda_large_text";

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
    setSavedPrograms(normalizeSavedPrograms(readStoredJSON(SAVED_KEY)));
    setCheckedRequirements(migrateRequirements(readStoredJSON(CHECKED_KEY)));
    setIsLargeText(readStoredJSON(LARGE_TEXT_KEY) === true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredJSON(SAVED_KEY, savedPrograms);
  }, [savedPrograms, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredJSON(CHECKED_KEY, checkedRequirements);
  }, [checkedRequirements, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredJSON(LARGE_TEXT_KEY, isLargeText);
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
    const program = programs.find((item) => item.id === programId);
    if (!program?.requirement_ids.includes(requirement)) return;
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
