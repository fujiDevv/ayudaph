"use client";

import { type ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <StoreProvider>{children}</StoreProvider>
    </I18nProvider>
  );
}
