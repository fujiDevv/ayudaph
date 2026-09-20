"use client";

import { useEffect } from "react";

/**
 * Registers the Ayuda service worker so the directory, saved benefits and
 * checklists keep working offline.
 *
 * Registration is limited to production builds: a service worker in front of
 * the dev server would serve stale chunks and break HMR.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Ayuda: service worker registration failed", error);
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
