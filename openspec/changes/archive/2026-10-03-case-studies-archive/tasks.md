## 1. Declare the domain taxonomy in the content model

- [x] 1.1 Add `CASE_STUDY_DOMAINS` (`infrastructure`, `cloud`, `cybersecurity`, `networking`, `devops`, `software`, `iot`) and the derived `CaseStudyDomain` type to `lib/content/schema.ts`, following the `PROJECT_CATEGORIES` pattern, with a comment recording why `it-operations` is excluded
- [x] 1.2 Add `domains: { kind: 'oneOf', values: CASE_STUDY_DOMAINS, optional: true }` to `PROJECT_SCHEMA` in `lib/content/schema.ts`, positioned after `category`
- [x] 1.3 Confirm `checkField` handles a repeated `oneOf` list without a new `FieldKind` — if it cannot, add a `oneOfList` kind rather than special-casing `domains` inside the validator
- [x] 1.4 Add a `readonly domains: readonly CaseStudyDomain[]` field to the `CaseStudy` interface in `lib/content/model.ts`, empty rather than absent, so a consumer never branches on presence
- [x] 1.5 Resolve `domains` in `buildCaseStudies` in `lib/content/model.ts` via `splitList` and `asOneOf`, and include it in `PendingCaseStudy`'s `Omit` list so the record type stays the single source of truth
- [x] 1.6 Add the `domains` column to `content/case-studies.csv`, positioned after `category`, and leave every cell empty
- [x] 1.7 Run `npx tsc --noEmit` and `npm run build` — both must pass with the new column empty, proving an unpopulated optional field is not a build break

## 2. Populate the domain column

- [x] 2.1 Classify each of the seven case studies into one or more domains from that record's own title, description, and declared technologies — no domain may be assigned from outside the record, and no description may be rewritten to fit a domain
- [x] 2.2 Write the classified values into `content/case-studies.csv`, leaving a record's `domains` cell empty if the recorded content supports no domain in the set
- [x] 2.3 Run `npm run build` and confirm validation passes with every value drawn from `CASE_STUDY_DOMAINS`
- [x] 2.4 Report the full slug-to-domains mapping to the owner and note that it is a data edit, not a code change — an incorrect value is corrected in the CSV rather than in the taxonomy

## 3. Derive the archive's filter sets and orderings

- [x] 3.1 Add an `ArchiveFilterGroup` type and a `deriveArchiveFacets(published)` helper to `lib/content/derive.ts` that walks the published case studies and returns, per group (`category`, `domain`), each distinct declared value with its count and its `href` query parameters
- [x] 3.2 Add the three orderings to `lib/content/derive.ts`: `title` (locale-aware, tiebroken on slug so equal titles cannot reorder between builds), `featured` (declared marker ascending, unfeatured last), and `technology-count` (descending by resolved technology count, tiebroken on title)
- [x] 3.3 Add a `dateOrderingAvailable` flag to `derive.ts` that is true only when at least one published case study records a `year`, and a `year` ordering that sorts those case studies by their recorded year
- [x] 3.4 Export the filter application as a pure function `applyArchiveView(published, selection)` returning the narrowed, ordered set and its count, so the count is computed from the same records the grid renders rather than alongside it
- [x] 3.5 Add a query-parameter parser in `lib/content/` that drops any `category`, `domain`, or `sort` value outside its permitted set and ignores unrecognised parameters, per design decision D7
- [x] 3.6 Add a helper that rebuilds one group's parameters while preserving the others, so toggling a filter in one group does not clear the other
- [x] 3.7 Assert in `derive.ts` that no category or domain label appears as a string literal outside `CASE_STUDY_DOMAINS` and the content files

## 4. Build the archive components

- [x] 4.1 Create `components/archive/filter-chip.tsx` — a `next/link` shaped like `TokenChip`, taking `href`, `label`, `count`, and `selected`; no `className` override, per design decision D5
- [x] 4.2 Style `filter-chip.tsx` with the resting roles from design decision D6 — `border-border-strong`, `bg-surface-inset`, `text-text-secondary` — using `border-strong` rather than `border` because the control is interactive
- [x] 4.3 Style the selected state of `filter-chip.tsx` as `bg-accent-subtle` with `border-accent` and `text-accent`, add an `aria-hidden` `h-2 w-2 rounded-xs bg-accent` marker mirroring `nav-link.tsx:34`, and set `aria-current="true"` when selected
- [x] 4.4 Create `components/archive/filter-group.tsx` rendering one filter axis as a labelled group, each chip carrying the count derived in task 3.1
- [x] 4.5 Create `components/archive/case-study-card.tsx` composing the existing `Card` from `components/ui/card.tsx`, rendering title, description, category chip, domain chips, and technology tags via `TokenChipList`
- [x] 4.6 In `case-study-card.tsx`, render the featured state as a `TokenChip` reading `Featured` rather than a `StatusIndicator`, per design decision D11, and omit the chip entirely when the record carries no marker
- [x] 4.7 In `case-study-card.tsx`, link to `/projects/${caseStudy.slug}` rather than to `liveUrl`, and mark the live and source destinations `external` with the new-tab attributes and the visually hidden note
- [x] 4.8 Confirm `case-study-card.tsx` renders no year, role, count, or duration when the record states none — no placeholder, dash, or "not recorded"
- [x] 4.9 Create `components/archive/archive-toolbar.tsx` rendering both filter groups and the ordering controls as links, omitting the date ordering unless `dateOrderingAvailable` is true

## 5. Add the archive route

- [x] 5.1 Create `app/projects/page.tsx` as a Server Component that awaits `searchParams` and reads `DERIVED.publishedCaseStudies`
- [x] 5.2 Parse `category`, `domain`, and `sort` through the parser from task 3.5, apply them through `applyArchiveView`, and render the resulting set — so an unrecognised value renders the archive rather than failing the request
- [x] 5.3 Render the responsive card grid with `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`, inheriting the shell from the root layout with no shell of its own
- [x] 5.4 Render the count of the presented set from `applyArchiveView`, not from `DERIVED.statistics.caseStudyCount`, so the figure and the grid cannot disagree
- [x] 5.5 Render an explicit empty state when the filters match nothing, and a separate empty state when no case study is published — neither renders an empty grid or a placeholder card
- [x] 5.6 Render a "Clear filters" link to `/projects` when any filter or ordering is active
- [x] 5.7 Add page metadata for the archive route, reusing `components/ui/metadata.tsx` and declaring no figure in it
- [x] 5.8 Confirm the route introduces no `'use client'` directive and no client leaf, and that `npm run build` reports `/projects` as dynamic while `/projects/[slug]` stays prerendered for all seven slugs

## 6. Update the surfaces that already exist

- [x] 6.1 Add the case study's domains to the chip list in `app/projects/[slug]/page.tsx`, omitting the region entirely when the record declares none
- [x] 6.2 Change the back link in `app/projects/[slug]/page.tsx` from `/` labelled "Back to the portfolio" to `/projects` labelled "All case studies"
- [x] 6.3 Replace the sentence in `components/sections/featured-work.tsx:49` so it names no engagement category and makes no claim that unfeatured work is unavailable on request, keeping the shown-versus-total count
- [x] 6.4 Add an archive link to `components/sections/featured-work.tsx` shown only when the featured count is below the total
- [x] 6.5 Confirm `lib/navigation.ts` gains no per-case-study entry, and that any archive entry is a single destination independent of the case-study count

## 7. Tests

- [x] 7.1 Add cases to `lib/content/csv.test.ts` — or a sibling `lib/content/schema.test.ts` — covering a `domains` value outside the set failing validation and an empty `domains` cell passing, run with `node --test`
- [x] 7.2 Add cases for the query-parameter parser: a permitted value, a value outside the set, a repeated value, and an unrecognised parameter name
- [x] 7.3 Add cases for `applyArchiveView`: one group narrowing, a union within one group, an intersection across groups, an empty result, and each of the orderings including the `featured`-unfeatured-last rule
- [x] 7.4 Add a case asserting `dateOrderingAvailable` is false while no published case study records a year and true once one does
- [x] 7.5 Add a case asserting the derived facet list omits any value no published case study carries
- [x] 7.6 Run `node --test lib/content/*.test.ts` and confirm every case passes

## 8. Verify

- [x] 8.1 Run `npm run lint`
- [x] 8.2 Run `npx tsc --noEmit`
- [x] 8.3 Run `npm run build`
- [x] 8.4 Fetch `/projects` and confirm every published case study has a card, that the card count equals the derived published count, and that no unpublished record appears
- [x] 8.5 Fetch `/projects?category=Freelance` and `/projects?domain=iot&sort=title` and confirm each returns the narrowed, ordered set with a matching count
- [x] 8.6 Fetch `/projects?sort=bogus&category=Nonexistent` and confirm the archive still renders rather than erroring
- [x] 8.7 Fetch `/projects` with client scripts disabled and confirm the full card set is present in the returned markup
- [x] 8.8 Inspect the client bundle and confirm it contains no case-study record, no derived facet set, and no serialised content index
- [x] 8.9 Confirm each of the seven `/projects/<slug>` addresses still serves its case study and now links back to the archive
- [x] 8.10 Run `openspec validate --specs --strict` and confirm all specs still pass
