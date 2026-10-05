## Context

Motivation is in [proposal.md](./proposal.md) — Why. Normative behaviour is in [`specs/`](./specs). This document records the technical choices behind that spec.

Constraints read from the repo, not assumed:

- **The design system is landed and archived.** `app/globals.css` holds 17 colour roles, a 4px spacing base, three radii capped at 6px, and seven type steps. `components/ui/` has `Button`, the `Card` family, `Metadata`/`MetadataList`, and `StatusIndicator`. `components/layout/` has `PageShell`, `SiteHeader`, `SiteFooter`, `SkipLink`, and `NavLink`. The token and primitive specs are the standing contract; this change consumes them and adds no new token or primitive.
- **`package.json` is the untouched `create-next-app` runtime set** — `next`, `react`, `react-dom` — and the archived `ui-primitives` spec requires that adding a primitive SHALL NOT require a runtime dependency. This change keeps that property.
- **`app/page.tsx` is a synthetic placeholder** that says so in its own copy. It is being replaced, not extended.
- **Source data facts are measured, not assumed.** `projects.csv` has 7 records, `experiences.csv` 20, `certifications.csv` 6. Distinct technologies across project stacks: 16. Records with a `Leadership` badge: 9. Certification issuers: 5 distinct across 6 records. Earliest year present in any duration: 2022; 4 records denote ongoing work.
- **The profile image is 6000×4000 at 11.2 MB.** Both v1 images are 24-megapixel captures.

## Goals / Non-Goals

**Goals**

- One content source of truth, inside the repository, that a deployed build can satisfy unaided.
- Every displayed figure computed from that content, so editing a data file changes the page.
- A build that fails loudly and specifically on bad data, instead of rendering a hole.
- Classification that counts what a human would count, with alias double-counting made impossible.
- A landing page composed entirely from existing primitives, adding no token and no client component.
- Correct the mechanical data defects in the source rather than teaching the renderer to tolerate them forever.

**Non-Goals** (design-level boundaries; feature-level exclusions are in [proposal.md](./proposal.md) → Non-goals)

- No content editing UI, no CMS, no runtime content API.
- No incremental rebuild or content caching layer. Content is small and read once per build.
- No content versioning, diffing, or history. Git is the history.
- No taxonomy inference by machine learning or fuzzy matching. Classification is exact-token against a declared list, so an unrecognised provider is visible rather than guessed.
- No i18n or content localisation in this change.

## Decisions

### D1 — Content moves into `content/` and the upstream directory is left alone

The CSVs move from `../data for portfolio/` to `content/`.

**Why:** the current location cannot be deployed. A build that reads outside the repository produces a broken production bundle, and "works on my machine" is precisely the failure this change exists to remove.

**Why move rather than copy:** a copy creates two files that differ the moment either is edited, and nothing would say which one wins. Moving makes the repository the single source of truth.

**Deliberately not deleting the upstream directory.** It is the owner's working copy and this change does not presume to discard it. Leaving it is recorded as a follow-up for them to confirm, not assumed either way.

### D2 — CSV for collections, typed TypeScript for singleton prose

Repeating records stay delimited text. The identity, biography, and focus-area declarations become a typed module.

**Why the split is by shape and not convenience:** a collection benefits from a row-per-record format because the owner adds and removes rows constantly and never wants to touch code. Singleton prose does not benefit from that at all — it is edited as prose, has no repetition, and benefits from being type-checked. A biography with a misspelled field should fail `tsc`, not fail a build-time validator.

**Rejected:** typed modules for everything. It makes every content edit a code edit and a rebuild, and abandons a workflow the owner already uses.
**Rejected:** CSV for everything. The identity record has no rows to speak of, and would gain quoting and delimiter concerns for no benefit.

### D3 — An in-repo parser, no `papaparse`

`lib/content/csv.ts` implements the RFC 4180 subset the data actually uses: quoted fields, embedded commas and newlines, `""` escape, CRLF, and a leading byte-order mark.

**Why:** the format surface here is genuinely small, and the full generality of a third-party parser is not needed. It is also ~70 lines, which is cheaper to review than a dependency's behaviour is to trust.

**The honest counterweight:** a hand-written parser is the one component in this change that can be subtly wrong in ways that corrupt data silently — a mis-parsed quote produces plausible-looking garbage. That is why the parser is the one piece with table-driven tests (see Risks), and why validation runs on its output.

**Rejected:** `papaparse`. Battle-tested and would remove the main correctness risk, but it adds a runtime dependency to a project that has deliberately held at three, and the archived spec set treats that restraint as intentional rather than accidental.

### D4 — Validation fails the build and names file, record, and field

`lib/content/schema.ts` declares, per collection, which fields are required, which are optional, and which have a constrained value set. Any violation throws during the build.

**Why fail the build rather than warn or coerce:** every consumer of this content is a page that would otherwise render a silently wrong figure. A missing required field must never become a statistic that is quietly one too low. Coercion is specifically rejected — coercing an unknown project category into a default would launder a data error into a plausible-looking page.

**Why name the file, record, and field:** the owner edits these files by hand. An error that says only "invalid content" costs more time than it saves.

### D5 — `derive.ts` is the only place a number exists

All figures come from `lib/content/derive.ts`. Sections receive them as props and contain no literals.

**Why a single module rather than deriving inline where used:** it makes the "no hardcoded statistic" rule checkable. The assertion is not "someone remembered to derive it" but "grep the sections for a number and find none", which is a real test.

**Recomputed per build, never cached.** The content is a few kilobytes and read once. A cache would add a staleness failure mode — a figure that survived a content edit — in exchange for saving nothing.

### D6 — Cloud platforms are an alias-to-canonical map, not a keyword list

`lib/content/taxonomy.ts` maps aliases to canonical providers, and the figure counts distinct canonical values.

**Why this specifically:** measured against the real data, a flat keyword list returns **five** matches — AWS, Azure, Google Cloud, Microsoft Azure, Oracle Cloud — because `Azure` and `Microsoft Azure` are the same provider. The honest figure is **four**. A flat list would have shipped a wrong number that looked right, which is the worst failure mode available for a statistic.

**Why exact-token matching, not fuzzy:** an unrecognised provider must be absent from the count and visible to the owner. Fuzzy matching would quietly absorb an unknown value into a near-enough bucket, producing a plausible figure with no way to detect the error. The spec makes this the required behaviour rather than a limitation.

### D7 — Durations parse tolerantly, and unparseable ones are reported

Recognised patterns include an open-ended marker denoting ongoing work, which extends to the present. A duration matching nothing is excluded from date-derived figures and reported with its record identifier.

**Why report rather than drop:** the data contains a real typo — `Devember 2022` — in a record that also contains valid years. A silent drop would quietly shift the earliest-start figure without anyone noticing. A report names the record so the typo gets fixed.

**Known limit, accepted:** the `Devember` typo is *corrected in the source* by this change (D10), so the tolerant path is future-proofing rather than a workaround for today's file. The month name is still matched loosely so an unrelated typo later cannot silently move the years figure.

### D8 — Focus areas declare signals; counts are computed

A focus area declares a list of signal tokens, not a count and not a function. `derive.ts` maps a signal to a count over the content model.

**Why signals rather than a closure per focus area:** a function in a content file is logic wearing a data costume — it cannot be read at a glance, and it cannot be checked without executing it. A declared token list is greppable and the mapping lives in one place.

**Why omit the count when it is zero rather than showing `0`:** a zero with a focus-area label asserts the direction and then undercuts it with its own evidence. Omitting the number is the honest rendering.

### D9 — `featured` is an order index in the content file

`content/projects.csv` gains a `featured` column holding an integer order, empty for unfeatured projects.

**Why an index and not a boolean:** the owner asked to control which work leads and in what sequence. A boolean cannot express ordering; sorting by title would put the choice in the renderer.

**Unfeatured projects stay in the model.** They are excluded from the featured section, not deleted — and the section states the total when it exceeds the number shown, so a marked-but-unshown project is never invisible without explanation.

### D10 — Mechanical defects are fixed in the source, never worked around

Four corrections land in the content files: the whitespace-corrupted `year` header, the `.gitt` URL suffix, the `Devember` month typo, and the `competetice` type value.

**Why in the source and not in the parser:** a parser that silently repairs known defects is a parser that will keep repairing them after they are fixed, and it hides the defect from the owner in the meantime. The parser's only normalisations are the general ones in the spec — trim, typographic quotes, BOM — which apply to any input.

### D11 — Contradictory prose is rendered faithfully and reported, never rewritten

Several experience records have descriptions that contradict their own titles — a *Director for Cloud Computing* described as having built Android applications. These render exactly as written, and the discrepancy is reported to the owner.

**Why this is the hard boundary of the change:** correcting a typo is mechanical and verifiable. Rewriting a sentence about someone's career is neither, and inventing plausible text about a real person's work is not something this change is entitled to do. A landing page that quietly improves someone's history is worse than one that shows an inconsistency.

### D12 — Server Components only; content never reaches the browser

Sections are Server Components reading the content model directly. No content is passed through a client boundary.

**Why it matters beyond bundle size:** the figures are computed on the server and present in the first response, so the page is correct without JavaScript. This is also why the statistics need no client-side recomputation and cannot drift from the server render.

**`NavLink` remains the only client leaf.** Adding a second one for, say, an animated counter would put a figure in the client bundle and make the no-script case degrade — directly against the accessibility requirement.

### D13 — The profile image is resized at the source, not just at delivery

`Main.JPG` is downscaled with the available ImageMagick to a width suited to its largest rendered size and re-encoded, and the original is not committed.

**Why not rely on the framework alone:** the framework will serve a correctly sized derivative, but the 11.2 MB original still lands in the repository and still has to be read and processed on every build. Fixing it at the source removes the cost as well as the transfer.

**Why preserve aspect rather than crop to a square:** the capture is 3:2 and cropping at the source would discard composition the owner chose. The square crop happens in CSS at a fixed aspect ratio, so the choice stays reversible.

**Target, verified achievable:** 1600px wide at quality 82 lands the file in the low hundreds of kilobytes — roughly a 98% reduction from 11.2 MB.

### D14 — Section anchors join the single navigation source

The landing page's sections are reachable as in-page anchors, declared in `lib/navigation.ts` alongside the route entries.

**Why not a hand-rolled section list in the hero:** the archived `app-shell` spec requires navigation to come from one declared source, and requires the desktop and disclosure navigations to agree. A second list would violate a standing requirement.

**No scroll-spy.** Marking the current section would need scroll observation, which is client JavaScript and motion — both outside this change. The active *route* indication the spec requires is unaffected.

### D15 — Exactly one primary call to action

The hero gets one `primary` button; the profile and footer-adjacent actions use `secondary` and `ghost`.

**Why:** the archived `ui-primitives` spec caps a view at one primary action so the highest-priority action is unambiguous. Three equally loud buttons would defeat it.

## Risks / Trade-offs

- **The hand-written parser can corrupt data silently.** A mis-handled quote yields plausible-looking wrong values, which is the worst failure mode for content. → The parser is the only component with table-driven tests, covering embedded commas, embedded newlines, `""` escapes, CRLF, BOM, and the ragged-row case. Tests run before any page is built.
- **Build-failing validation can block the owner mid-edit.** Saving a half-finished row breaks the build. → Errors name file, record, and field so the fix is immediate, and the design deliberately prefers a blocked build to a wrong figure. If this proves too strict in practice, downgrading to a warning is a single, local change to `schema.ts`.
- **Correcting the source diverges the upstream copy.** After this change, `../data for portfolio/` no longer matches `content/`. → Deliberate and stated. The repository is now authoritative, the upstream directory is left intact rather than deleted, and the proposal records that the owner should confirm retiring it. Nothing silently overwrites their working copy.
- **Some figures are unflattering, and that is the point.** Cybersecurity evidence resolves to a single record; the figure band reflects the content as it is. → No figure is inflated, no count is invented, and a focus area with no evidence shows no number at all. A landing page that rounds up is the thing this design system was built to avoid.
- **"Years of practice" is derived from the earliest recorded experience, which is 2022.** If activity predates the recorded content, the derived span understates it. → Computed rather than stated, so it is at least honest about its own basis. It is a single derivation site and can be widened if the owner adds earlier records.
- **An order index in a CSV column is weakly typed.** A malformed value like `featured=first` would fail validation. → Accepted: it fails the build loudly under D4 rather than sorting unpredictably, which is the correct trade for a hand-edited file.
- **Reading content at module scope couples rendering to the filesystem.** → Standard for build-time content in a statically generated App Router site, and the reason the landing page adds no client code. The alternative — a runtime API — would add a request to every page view to serve a few kilobytes.
- **Resizing the profile image is lossy and irreversible from the repo alone.** → The original remains available in the upstream v1 directory and in git history before this change. The derivative is committed; the capture is not, which is the point.

## Migration Plan

Preconditions: the design system is landed and archived; `app/page.tsx` holds only synthetic placeholder content, so nothing real is overwritten.

1. Create `content/` and move the three CSVs in; apply the four mechanical corrections (D10). Nothing renders from them yet.
2. Add `lib/content/csv.ts` and its tests. Run the tests; do not proceed on a failing parser.
3. Add `lib/content/schema.ts` and `lib/content/model.ts`; confirm the model validates against the real files.
4. Add `lib/content/taxonomy.ts` and `lib/content/derive.ts`; confirm the derived figures equal the values measured during planning.
5. Add `content/education.csv` and `content/site.ts`.
6. Produce the right-sized profile image into `public/images/`.
7. Add `components/sections/*` and rewrite `app/page.tsx` to compose them.
8. Add the section anchors to `lib/navigation.ts`.
9. Verify: tests, `npm run lint`, `npx tsc --noEmit`, `npm run build`. Then confirm in a real browser that the page needs no client JavaScript, that no figure is a literal in any section, and that the document does not scroll horizontally at the narrowest supported width.

**Rollback:** the change touches `app/page.tsx` and `lib/navigation.ts`, adds `content/`, `lib/content/`, and `components/sections/`, and adds one image. Rollback is a revert of that commit — no database, no external service, no deployed state. The synthetic placeholder page returns intact.

**Verification gates:** each numbered group leaves the build green. The change is not complete until the parser tests, lint, typecheck, and build all pass, and the derived figures have been checked against the values measured during planning.

## Open Questions

Genuinely deferrable — none would change the specs, the chosen approach, or the task breakdown:

- **Should the upstream `../data for portfolio/` directory be retired?** This change leaves it in place and stops reading it. Confirming and deleting it is the owner's call.
- **Should token-discipline rules (no raw colours, radii ≤ 6px) gain a lint rule?** Still deferred, carried forward unchanged from the design-system change. The landing page is checked by review in the meantime.
- **What is the largest rendered size of the profile image?** 1600px is chosen as a safe upper bound for a portrait displayed at most a few hundred CSS pixels. Tightening it once real breakpoints are known is a single re-run.
- **Should derived figures be exposed as structured data for SEO?** Out of scope here; it becomes relevant when the credential and case-study routes exist.