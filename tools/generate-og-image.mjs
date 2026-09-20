#!/usr/bin/env node
/**
 * Renders `tools/og-image.html` to `public/og/og-default.png` (1200x630) using
 * headless Chrome.
 *
 *   node tools/generate-og-image.mjs
 *
 * The brand mark is inlined as a data URI so the render never depends on
 * file:// asset permissions. Re-run this whenever the headline or palette in
 * the template changes.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const WIDTH = 1200;
const HEIGHT = 630;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const templatePath = join(here, "og-image.html");
const logoPath = join(root, "public/logos/svg/BetterGov_Icon-White.svg");
const outPath = join(root, "public/og/og-default.png");

/** Locate a Chrome/Chromium binary, honouring CHROME_PATH. */
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];

  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ["--version"], { stdio: "ignore" });
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error(
    "Could not find Chrome or Chromium. Install one, or set CHROME_PATH to the binary.",
  );
}

const logoDataUri = `data:image/svg+xml;base64,${readFileSync(logoPath).toString("base64")}`;
const html = readFileSync(templatePath, "utf8").replaceAll("__LOGO__", logoDataUri);

if (html.includes("__LOGO__")) {
  throw new Error("Template placeholder __LOGO__ was not fully replaced.");
}

const workspace = mkdtempSync(join(tmpdir(), "ayuda-og-"));
const stagedHtml = join(workspace, "og-image.html");
writeFileSync(stagedHtml, html, "utf8");

mkdirSync(dirname(outPath), { recursive: true });

const chrome = findChrome();
execFileSync(
  chrome,
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${WIDTH},${HEIGHT}`,
    // Give the web font time to load before the shot is taken.
    "--virtual-time-budget=8000",
    `--screenshot=${outPath}`,
    pathToFileURL(stagedHtml).href,
  ],
  { stdio: "inherit" },
);

console.log(`Wrote ${outPath} (${WIDTH}x${HEIGHT})`);
