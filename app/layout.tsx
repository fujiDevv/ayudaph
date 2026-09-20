import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/layout/Navbar";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import {
  AUTHOR,
  OG_IMAGE,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const TITLE = `${SITE_NAME} — Philippine Government Social Benefits Navigator`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR, url: REPO_URL }],
  creator: AUTHOR,
  publisher: AUTHOR,
  category: "government",
  keywords: [
    "Ayuda",
    "ayudaph",
    "Philippines",
    "government benefits",
    "social welfare",
    "financial assistance",
    "DSWD",
    "4Ps",
    "AICS",
    "SSS",
    "GSIS",
    "PhilHealth",
    "Pag-IBIG",
    "DOLE",
    "DOH",
    "OWWA",
    "CHED",
    "TESDA",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logos/svg/BetterGov_Emblem-Outline-Inversed.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description:
      "An independent, open-source navigator for Philippine government social welfare programs.",
    locale: "en_PH",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "An independent, open-source navigator for Philippine government social welfare programs.",
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0066eb",
};

/** Structured data describing the project and crediting its owner. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Ayuda PH",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: ["en-PH", "tl-PH"],
  isAccessibleForFree: true,
  author: { "@type": "Person", name: AUTHOR, url: REPO_URL },
  publisher: { "@type": "Person", name: AUTHOR },
  license: `${REPO_URL}/blob/main/LICENSE`,
  sameAs: [REPO_URL],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <ServiceWorkerRegister />
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="h-[104px]" />}>
              <Navbar />
            </Suspense>
            <Ticker />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
