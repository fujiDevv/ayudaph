/**
 * Canonical origin for the deployed site.
 *
 * Defaults to the production domain so sitemap.xml, robots.txt and canonical
 * tags are correct without extra configuration. Override with
 * NEXT_PUBLIC_SITE_URL to point a staging build (for example
 * `https://ayudaph.<account>.workers.dev`) somewhere else.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayudaph.org"
).replace(/\/+$/, "");

/** Project name, used for the wordmark and JSON-LD. */
export const SITE_NAME = "Ayuda";

/** Owner and maintainer of this project. */
export const AUTHOR = "Joshua Sarmiento";

/** Public source repository — the target for every "contribute" and "issues" link. */
export const REPO_URL = "https://github.com/fujiDevv/ayudaph";

/** Shared meta description, reused by the layout and the web app manifest. */
export const SITE_DESCRIPTION =
  "Search, filter, and track Philippine government social benefits from DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA, CHED, and TESDA.";

/**
 * Social share card. Regenerate with `pnpm og:image` after editing
 * `tools/og-image.html`.
 */
export const OG_IMAGE = {
  url: "/og/og-default.png",
  width: 1200,
  height: 630,
  alt: "Ayuda — find the Philippine government benefits you're entitled to. 20 programs across DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA, CHED, and TESDA.",
};
