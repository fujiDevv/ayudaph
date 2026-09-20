# Contributing to Ayuda

<a id="readme-top"></a>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#welcome">Welcome</a></li>
    <li><a href="#ways-to-contribute">Ways to contribute</a></li>
    <li><a href="#ground-rules">Ground rules</a></li>
    <li><a href="#environment-setup">Environment setup</a></li>
    <li><a href="#development-loop">Development loop</a></li>
    <li><a href="#adding-or-updating-a-program">Adding or updating a program</a></li>
    <li><a href="#translations">Translations</a></li>
    <li><a href="#styling-and-theming">Styling and theming</a></li>
    <li><a href="#code-conventions">Code conventions</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#commits-and-pull-requests">Commits and pull requests</a></li>
    <li><a href="#reporting-issues">Reporting issues</a></li>
    <li><a href="#code-of-conduct">Code of conduct</a></li>
  </ol>
</details>

## Welcome

Thank you for helping make Philippine government social benefits easier to navigate. Ayuda exists
so that a person holding a phone, a hospital bill, and no idea which office to visit can find a
straight answer.

Ayuda is created and maintained by **Joshua Sarmiento**.

- **Repository:** <https://github.com/fujiDevv/ayudaph>
- **Live site:** <https://ayudaph.org>

This guide covers how to propose changes. For an architectural overview, read the
[README](./README.md) first.

## Ways to contribute

You do not need to be a developer to help.

- **Data** — add a missing benefit, or correct fees, requirements, and processing times.
- **Translations** — improve the Tagalog copy, or help keep both languages in sync.
- **Code** — fix bugs, improve components, or work through the roadmap.
- **Design** — improve accessibility, contrast, and readability.
- **Documentation** — sharpen this guide or the README.
- **Triage** — reproduce reported issues and confirm which programs are affected.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Ground rules

- **Accuracy over speed.** Wrong benefit information can cost someone a wasted trip. Cite an
  official source for every data change.
- **Verify, do not assume.** Government rules change without notice. Check the agency portal or
  Citizen's Charter rather than trusting an older copy of the data.
- **Respect privacy.** Never add analytics, trackers, accounts, or anything that sends personal
  data to a server. Ayuda must stay fully usable offline and anonymous.
- **Stay accessible.** Every change should keep working with large text, a screen reader, and a
  slow connection.
- **Keep it non-partisan.** No political content, endorsements, or campaign material.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environment setup

1. **Fork and clone** the repository.

2. **Install prerequisites:** Node.js 22+ and pnpm 11+. The pnpm version is pinned in
   `package.json`.

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Start the dev server:**

   ```bash
   pnpm dev
   ```

   It opens on <http://localhost:3000>.

A Cloudflare account is only needed for deployment, not for local development.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development loop

Before opening a pull request, all three of these must pass:

```bash
pnpm typecheck   # TypeScript
pnpm test        # Vitest
pnpm build       # production Worker build
```

Useful while iterating:

```bash
pnpm test:watch  # re-run tests on save
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Adding or updating a program

The dataset lives in `data/programs.json`. Add or edit an entry using this schema:

```json
{
  "id": "agency-benefit-slug",
  "agency": "DSWD",
  "name": "Full Name of the Program (Acronym)",
  "category": "Financial / Education / Health",
  "description": "Plain-language summary of the benefit and who it is for.",
  "target_audience": ["Indigent", "Low Income", "Seniors"],
  "processing_time": "e.g. 15-20 working days",
  "official_url": "https://www.dswd.gov.ph",
  "steps": ["First thing the applicant does", "Second step"],
  "requirements": ["Required document one", "Required document two"],
  "tags": ["financial", "medical"]
}
```

Field notes:

- **`id`** must be unique and slug-shaped (`agency-benefit`). It is used in URLs and as the locale
  key, so it must never be renamed carelessly.
- **`category`** may combine values with ` / `. The directory filter and the analytics charts split
  on that separator, so each part becomes its own filter option.
- **`target_audience`** and **`tags`** power the wizard scoring and the audience/tag charts. Reuse
  existing values where possible so the filters do not fragment.
- **`official_url`** must be an official `https://` agency page.

### Then add the display copy — this step is not optional

Descriptions, names, steps, and requirements are rendered from the locale files, not from the JSON.
For every program you must add a matching entry to **both** `lib/i18n/en.json` and
`lib/i18n/tl.json`:

```json
"programs": {
  "agency-benefit-slug": {
    "name": "Full Name of the Program (Acronym)",
    "description": "Plain-language summary of the benefit and who it is for.",
    "steps": ["First thing the applicant does", "Second step"],
    "requirements": ["Required document one", "Required document two"]
  }
}
```

`test/data-integrity.test.ts` enforces this contract and will fail if:

- a program is missing from either locale file,
- a name or description is empty,
- the number of `steps` or `requirements` does not match `programs.json`.

If you cannot write the Tagalog copy yourself, add a best-effort translation and note it in the pull
request — an imperfect translation is better than an English string leaking into the Tagalog
interface.

### Data authenticity

Every added or modified benefit must be traceable to an official source, such as an agency website,
a published Citizen's Charter, or an official issuance. Include those links in your pull request
description so reviewers can verify the claim.

Note that programs are sometimes defunded or absorbed into another program. When that happens,
remove the entry rather than leaving stale guidance — and mention the source that confirms it in
your pull request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Translations

Both interface strings and program copy live in `lib/i18n/en.json` and `lib/i18n/tl.json`.

- Add the key to **both** files. English is the fallback, so a missing Tagalog key would silently
  render in English.
- Keep placeholders such as `{count}` or `{step}` intact — only translate the surrounding text.
- A test asserts both files expose an identical key set, which is what stops key drift.

To add a whole new language:

1. Copy `lib/i18n/en.json` to `lib/i18n/<code>.json` and translate the values.
2. Register it in `lib/i18n/index.tsx` (`MESSAGES` and `LANGUAGES`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Styling and theming

The design system is ported from BetterGov.ph and defined once in `app/globals.css` under
Tailwind v4 `@theme` tokens.

- **Use the tokens**, not raw palette values: `bg-primary-500`, `text-gray-700`, `border-gray-200`.
  Reach for `secondary-*` for DSWD-flavoured accents and `accent-*` for bookmarks and highlights.
- **Do not hardcode hex colours** in components.
- **Dynamic class names must be literal strings.** Tailwind scans source text, so a class assembled
  at runtime will not be generated. Build a lookup keyed by value instead:

  ```ts
  const AGENCY_BAR: Record<string, string> = {
    DSWD: "bg-orange-500",
    SSS: "bg-blue-600",
  };
  ```

- **Merge conditional classes with `cn()`** from `lib/utils.ts` rather than concatenating strings.
- The UI is **light-only**, matching BetterGov.ph. Do not add `dark:` variants.
- Reuse the existing primitives in `components/ui/` before creating new ones.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Code conventions

- **Routing.** Each `app/**/page.tsx` is a server component that exports `metadata` and renders an
  interactive component from `components/<feature>/`. Add `"use client"` only to files that use
  hooks, state, or browser APIs.
- **Pure logic goes in `lib/`.** Filtering, scoring, and aggregation live in `lib/filtering.ts`,
  `lib/wizard.ts`, and `lib/analytics.ts` so they can be unit tested without a DOM. If you are
  writing a computation inside a component, consider whether it belongs in `lib/` with a test.
- **Imports** use the `@/` alias, which maps to the project root.
- **Icons** come from `lucide-react`; brand marks come from `@icons-pack/react-simple-icons`.
- **Local persistence** uses `localStorage`. Existing keys include `ayuda_saved`,
  `ayuda_checked_reqs`, `ayuda_large_text`, `ayuda_locale`, `ayuda_pathways_progress`,
  `ayuda_guide_checked`, and the locator caches (`ayuda_branches`, `ayuda_cached_bboxes`,
  `psgc_regions`, `psgc_provinces_<code>`, `geocode_<query>`). Use a new `ayuda_`-prefixed key
  rather than repurposing one.
- **External APIs** in the locator (PSGC, Nominatim, Overpass) are rate-limited public services.
  Cache responses, keep timeouts, and never introduce a hot request loop.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing

Tests live in `test/` and run with Vitest in a Node environment.

```bash
pnpm test
```

Please add or update tests when you change behaviour. The most valuable tests here are on pure
logic, so prefer extracting a helper into `lib/` over testing through a component.

Current suites:

| File                            | Covers                                        |
| ------------------------------- | --------------------------------------------- |
| `filtering.test.ts`             | Directory search, agency/category/audience    |
| `wizard.test.ts`                | Eligibility scoring and recommendation order  |
| `analytics.test.ts`             | Aggregations and donut geometry               |
| `letterTemplates.test.ts`       | Document generator output and HTML escaping   |
| `data-integrity.test.ts`        | Dataset shape, EN/TL locale parity, freshness |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Commits and pull requests

1. **Branch** off `main` with a descriptive name, e.g. `feat/life-events-pathways` or
   `fix/socpen-payout-amount`.
2. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
   `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
   Example: `fix: correct the 4Ps First 1,000 Days grant amount`
3. **Verify** locally before pushing:

   ```bash
   pnpm typecheck && pnpm test && pnpm build
   ```

4. **Open a pull request** describing:
   - what changed and why,
   - the official source for any data change,
   - how you verified it (commands run, pages checked).

Keep pull requests focused. A data correction and an unrelated refactor should be two pull
requests, because they need different reviewers.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Reporting issues

When filing an issue, include:

- the page or program affected (and its `/programs/<id>` URL if applicable),
- what you expected versus what you saw,
- the official source that contradicts the current data, where relevant,
- your browser and device, plus a screenshot for anything visual.

For **data errors**, the source link matters more than anything else — it is what lets a maintainer
verify and merge the fix quickly.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Code of conduct

By participating in this project you agree to uphold a welcoming, respectful, and inclusive
environment. Harassment, discrimination, and bad-faith behaviour are not tolerated. Assume good
intent, give constructive feedback, and remember that the people this project serves are often
having a very difficult week.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
