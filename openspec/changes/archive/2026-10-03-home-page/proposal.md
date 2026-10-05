## Why

`glides-dev-v2` currently has a working design system and no content. `app/page.tsx` is a synthetic placeholder whose own copy says so: "This page is a placeholder composition… real portfolio content arrives with the case-study, credential, and terminal work." The landing page is the site's front door and it is the one surface a visitor always sees, so it cannot wait behind the deeper features.

Two things block it today, and neither is a styling problem.

**There is no content model.** The archived design-system change explicitly deferred content loading, so nothing in this repo can answer "how many projects are there" without a human hardcoding the number into markup. The source data lives at `../data for portfolio/` — *outside* the repository — so it would not exist in a deployed build at all. Education has no source anywhere: in the v1 portfolio it was hardcoded JSX inside `components/sections/EducationSection.tsx`. The requested statistics therefore cannot be derived today, which is exactly why the request forbids hardcoding them.

**The source data cannot be parsed naively.** Measured, not assumed:

- `certifications.csv` has the header `title,organization,&#32;&#32;year,description,color,url` — two leading spaces before `year`, so a standard parser yields the key `'  year'` and reading `year` raises `KeyError`.
- `projects.csv` row "Care Max" carries `githubUrl` ending in `.gitt`, which renders as a broken link.
- `experiences.csv` contains `"Devember 2022"` and the type value `competetive`; one field has an embedded newline inside quotes; several fields use typographic apostrophes.
- Several experience rows have descriptions that do not match their titles — "Director for Cloud Computing" is described as "Built Android applications". These are content errors, not code errors, and are called out rather than silently rewritten.

Every statistic the landing page needs is genuinely derivable from the corrected data — 7 projects, 16 distinct technologies, 20 roles, 9 leadership roles, 6 certifications, 4 distinct cloud platforms, and years-in-practice computed from durations. None of them need to be typed by hand.

## What Changes

- **Introduce a typed content model** as the site's single source of truth. Collections move into `content/` inside the repository; singleton editorial prose lives in a typed module. Repeating records stay CSV so the existing "edit the file, refresh" workflow survives; the split is a stated rule, not an accident.
- **Correct the source data at the source.** Fix the whitespace-corrupted header, the broken `.gitt` URL, the `Devember` typo, and the `competetive` type value. Descriptive prose that contradicts its own record is reported for the owner to rewrite, not invented by this change.
- **Add a build-time ingest and validation layer.** A small in-repo CSV parser reads `content/*.csv`, normalises headers and fields, validates every record against its schema, and **fails the build** on a violation rather than rendering a blank. No parsing dependency is added.
- **Derive every statistic from the content model.** Counts, distinct values, and date ranges are computed. Adding a project to `content/projects.csv` changes the rendered numbers with no code edit — this is the acceptance criterion, and it is verifiable.
- **Declare classification taxonomies as data, not code branches.** Cloud platforms are matched through an alias-to-canonical-provider map, because a flat keyword list double-counts `Azure` and `Microsoft Azure` as two providers.
- **Add a `featured` order column to `content/projects.csv`** so the owner chooses which case studies lead the page and in what sequence.
- **Add `content/education.csv`**, giving education a real source for the first time.
- **Build the landing page** from the content model: a direct personal-introduction hero, a profile image area, a short biography, an education summary, technical focus areas, a statistics band, featured case studies, and primary calls to action.
- **Position infrastructure, cloud, cybersecurity, networking, and IT operations as the primary technical direction.** Each focus area declares the signals that support it, and its supporting count is computed from the content — so the page cannot claim a focus it has no evidence for.
- **Optimise the profile image.** `Main.JPG` is 6000×4000 at 11.2 MB. It is replaced with a right-sized derivative; the original is not committed.
- **Keep the whole page server-rendered.** Statistics and content are resolved on the server, so the landing page adds no client JavaScript beyond the single navigation leaf the shell already uses.
- **Extend navigation** to include the home route's section anchors, declared in the existing single navigation source.

## Capabilities

### New Capabilities

- `content-model`: The site's content layer — where content lives, how collections and singleton prose are represented, how CSV is parsed and normalised, how records are validated at build time, how all statistics are derived rather than authored, how classification taxonomies dedupe to canonical values, and the guarantee that content access stays server-side.
- `home-page`: The landing page itself — the personal-introduction hero, profile image area, biography, education summary, technical focus areas with computed evidence, the statistics band, featured case studies, and primary calls to action, including its accessibility, responsiveness, and server-rendering obligations.

### Modified Capabilities

None. The four existing capabilities keep their requirements unchanged:

- `app-shell` already requires the shell to be inherited from the root layout, navigation to come from one declared source, and the active route to be indicated. Adding a home route and section anchors satisfies those requirements without changing them.
- `design-tokens`, `typography`, and `ui-primitives` are consumed as written. This change introduces no new colour, no new type step, and no new primitive — it composes the existing four primitives and adds only page-level sections under `components/sections/`.

## Non-goals

- **Case-study detail pages.** The landing page shows featured case studies as cards. Narrative sections, per-project deep routes, and their layouts are a separate change.
- **Credential and experience listing pages.** Certifications and experience are summarised on the landing page. Full listing pages, filtering, and sorting are separate changes.
- **Terminal functionality.** No terminal is implemented. This change adds no terminal route, command set, or typewriter behaviour.
- **Migrating the remaining content into pages.** Projects, experience, and certifications appear only where the landing page needs them. A full content migration is not attempted.
- **Editing the owner's prose.** Career descriptions that contradict their own record are reported, not rewritten. Inventing a description of someone's job is not a code change.
- **A content authoring UI or CMS.** Content is edited as files.
- **Enforcing token discipline by tooling.** The archived `design-tokens` spec makes raw colour literals and off-scale radii normative violations enforced by review; adding a lint rule is still deferred and is not revisited here.
- **Image optimisation beyond the profile asset.** Only the profile image is resized. Any future imagery is handled with its feature.
- **SEO, OpenGraph, and structured data** beyond the root metadata already present.

## Impact

**Affected code**

- `app/page.tsx` — **replaced**. The placeholder composition is replaced by the real landing page.
- `app/globals.css` — **unchanged**. No new token is required. This is deliberate: adding a colour or type step here would weaken the guarantee that the archived spec describes.
- `app/layout.tsx` — **unchanged**.
- `lib/navigation.ts` — **modified**. Section anchors for the landing page are added to the single navigation source.
- `lib/layout.ts` — unchanged; the landing page reuses `SECTION_RHYTHM` and `CONTENT_GUTTER`.

**New files**

- `content/projects.csv`, `content/experiences.csv`, `content/certifications.csv` — moved in from `../data for portfolio/` and corrected.
- `content/education.csv` — new.
- `content/site.ts` — typed identity: name, role, biography, focus-area declarations.
- `lib/content/csv.ts` — the parser.
- `lib/content/schema.ts` — per-collection field definitions and validation.
- `lib/content/model.ts` — the typed content model, assembled from validated records.
- `lib/content/taxonomy.ts` — declared taxonomies, including the cloud alias-to-canonical map.
- `lib/content/derive.ts` — every statistic, computed.
- `components/sections/hero.tsx`, `profile.tsx`, `biography.tsx`, `education-summary.tsx`, `focus-areas.tsx`, `statistics.tsx`, `featured-work.tsx`, `calls-to-action.tsx`.

**Assets**

- `public/images/profile.jpg` — new, a right-sized derivative. The 11.2 MB `Main.JPG` is not copied.

**Dependencies**

None added. `package.json` stays at the `create-next-app` runtime set (`next`, `react`, `react-dom`). The parser is in-repo.

**Upstream**

`../data for portfolio/` is superseded by `content/`. It is not deleted by this change — it remains the owner's working copy until they confirm the move, and this is recorded as a follow-up rather than assumed.

**Risk**

Low and contained. The design system is untouched, so the blast radius is one page plus new files. The main risk is data quality: the change corrects mechanical defects in the source but deliberately leaves contradictory prose for the owner, which means the landing page will faithfully render a few mismatched descriptions until they are rewritten. That is visible and intentional rather than hidden.