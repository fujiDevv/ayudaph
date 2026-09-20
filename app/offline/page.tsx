import type { Metadata } from "next";
import { CloudOffIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline. Saved Ayuda content is still available.",
  // An error-state page; keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
      <span className="inline-flex p-4 rounded-full bg-gray-100 text-gray-500">
        <CloudOffIcon className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        You are offline
      </h1>
      <p className="mt-3 text-gray-600">
        Ayuda needs a connection the first time you open a page, but your saved
        benefits and document checklists stay available offline on this device.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shortlist"
          className="inline-flex items-center justify-center rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          View saved benefits
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Try the directory again
        </Link>
      </div>
    </div>
  );
}
