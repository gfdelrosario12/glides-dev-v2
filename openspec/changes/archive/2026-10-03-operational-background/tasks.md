## 1. Schema and content, together

The CSV reader compares each row's field count against the header and reports a row carrying
more fields than the schema declares, so adding a column without declaring it fails the
build, and declaring it without adding it fails validation for a missing field. Renaming
`type` to `track` is the same constraint in the other direction. One atomic edit.

- [x] 1.1 Replace `EXPERIENCE_TYPES` with `EXPERIENCE_TRACKS` (`professional`, `technical`, `leadership`, `community`, `event-operations`) and add `TRACK_ORDER` giving the presentation order, with the unclassified group last
- [x] 1.2 Move `EXPERIENCE_SCHEMA.identifier` and `.key` from `title` to `slug`, add `slug: { kind: 'slug' }`, replace `type` with `track: { kind: 'oneOf', values: EXPERIENCE_TRACKS, optional: true }`, and add `lessonsLearned: { kind: 'text', optional: true }`
- [x] 1.3 Move `QUALIFICATION_SCHEMA.identifier` and `.key` from `title` to `slug` and add `slug: { kind: 'slug' }`
- [x] 1.4 Rewrite all 20 rows of `content/experiences.csv`: drop `type`, add `slug`, `track`, and `lessonsLearned`, leave every other value byte-identical, and set `lessonsLearned` empty on all 20
- [x] 1.5 Rewrite all 3 rows of `content/education.csv` to add `slug`, leaving every other value byte-identical
- [x] 1.6 Author `track` for the 2 internship rows as `professional` and the 4 competitive hackathon rows as `technical`; leave the other 14 empty rather than guessing
- [x] 1.7 Author 20 experience slugs from organization and role rather than title, since several titles carry a semester marker or a year a correction would change — `sun-life-itsm-intern-1`, `sun-life-itsm-intern-2`, `cyberph-vp-operations`, `icpep-executive-vp`, `devcon-program-manager`, `arduino-day-event-ops-head`, `gdgc-cam CTO`, and the remaining thirteen derived the same way
- [x] 1.8 Author 3 education slugs — `pup-bsc-computer-engineering`, `pup-diploma-computer-engineering-technology`, `espiritu-santo-stem`
- [x] 1.9 Confirm `npm run build` passes, which proves the header, the arity, the six track values, and both slug sets all agree

## 2. The resolved records

- [x] 2.1 Extend `Experience` in `lib/content/model.ts` with `slug`, `track` (nullable), and `lessonsLearned` (nullable)
- [x] 2.2 Extend `Education` with `slug`
- [x] 2.3 Read `track` with `optionalText`-style narrowing so an empty cell is `null` rather than `''`, and read it from the declared column rather than inferring it from the role title or the organization
- [x] 2.4 Add `experiencesInRecencyOrder()`, sorting by `endDate` descending with a null `endDate` sorting as more recent than every ended span, then `startDate` descending, then `slug` ascending so the order is total
- [x] 2.5 Add `educationInRecencyOrder()` with the same comparator, using `endDate` then `startDate` then `slug`
- [x] 2.6 Add `experiencesByTrack()` returning declared groups in `TRACK_ORDER` plus one final unclassified group holding every record whose `track` is null
- [x] 2.7 Confirm `caseStudies` on an experience still resolves to case-study records, and that the case study's reverse `experiences` view is still derived from it

## 3. Components

Each takes already-resolved display values as props and imports nothing from `lib/content/`.
No file is added to `components/ui/`, because a primitive must not carry the vocabulary of an
experience or a qualification.

- [x] 3.1 Create `components/background/timeline.tsx` rendering an ordered list of entries, each anchored by its slug, with an explicit empty state naming the content source
- [x] 3.2 Create `components/background/experience-entry.tsx` composing `Card`, `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent`, presenting organization, role, period, and role shape
- [x] 3.3 Present `description` transcribed as written, with no summarising or rewording
- [x] 3.4 Present `responsibilities` as a list only when the record declares any, and omit the region entirely otherwise
- [x] 3.5 Present `tools` and `systems` as `TokenChipList` only when declared, omitting each region independently rather than as a pair
- [x] 3.6 Present `lessonsLearned` under its own heading when declared, and render no heading at all when absent
- [x] 3.7 Present the record's `skills` as chips, which every record declares
- [x] 3.8 Create `components/background/education-entry.tsx` presenting credential where declared, institution, period, location, fields of study, and the `detail` paragraph as written
- [x] 3.9 Create the group rail using `--color-border` with its group name as text, carrying no tone — a track is not a state and gets no `StatusIndicator`
- [x] 3.10 Confirm `npm run lint` passes, that `grep -rl "use client" components/background` returns nothing, and that `grep -rn "lib/content" components/background` returns nothing

## 4. Route and navigation

- [x] 4.1 Create `app/background/page.tsx` with an education timeline and an experience timeline, the latter grouped by `TRACK_ORDER` with the unclassified group last
- [x] 4.2 Give each experience group a labelled region and each track group a heading naming the kind of work, so a group is navigable rather than only visually separated
- [x] 4.3 Have an empty content source render a sentence naming what is absent, with no entry and no error
- [x] 4.4 Add one `{ kind: 'link', href: '/background', label: 'Background' }` entry to `PRIMARY_NAV` in `lib/navigation.ts`, and no per-record entry
- [x] 4.5 Confirm `npm run build` passes and the route table lists `/background` with no route file added by hand

## 5. Landing page becomes a pointer

- [x] 5.1 Reduce `components/sections/education-summary.tsx` to heading, count, three compact cards, and one `Button` to `/background`
- [x] 5.2 Remove the `detail` paragraph from the landing page's education summary, since the timeline presents it
- [x] 5.3 Confirm the landing page still renders, its education count still reflects the content, and it lists no experience entries
- [x] 5.4 Confirm the terminal's experience listing still works and still shows every record

## 6. Tests

- [x] 6.1 Add a case asserting a `track` outside `EXPERIENCE_TRACKS` fails validation and names the permitted values
- [x] 6.2 Add a case asserting an empty `track` validates, so the 14 unclassified rows are a legal state
- [x] 6.3 Add a case asserting a row still declaring `organizational` fails, because the field it belonged to no longer exists
- [x] 6.4 Add a case asserting two experiences cannot declare the same slug, and the same for two qualifications
- [x] 6.5 Add a case asserting an experience with an open period sorts ahead of one whose period ended, and one asserting equal periods break by `startDate` then `slug`
- [x] 6.6 Add a case asserting rearranging the content-file rows does not change the timeline order
- [x] 6.7 Add a case asserting every declared track group appears in `TRACK_ORDER` and the unclassified group is last
- [x] 6.8 Add a case asserting `lessonsLearned` accepts an empty cell
- [x] 6.9 Run `node --test lib/content/*.test.ts` and confirm every case passes, including the 175 that existed before this change

## 7. Verification

- [x] 7.1 Run `npm run lint` and confirm it is clean
- [x] 7.2 Run `npx tsc --noEmit` and confirm it is clean
- [x] 7.3 Run `npm run build` and confirm it passes
- [x] 7.4 Fetch `/background` and confirm all 20 experiences and all 3 qualifications appear, most recent period first
- [x] 7.5 Confirm the 6 authored tracks appear in their declared groups and the other 14 appear in the unclassified group, which renders last
- [x] 7.6 Confirm rearranging `content/experiences.csv` row order leaves the rendered order unchanged
- [x] 7.7 Confirm an entry with no responsibilities, tools, systems, lessons, or case studies shows no placeholder for any of them, and that at least one such entry exists in the current content
- [x] 7.8 Confirm navigation gained exactly one item and no per-record entry
- [x] 7.9 Confirm the landing page's education summary presents no `detail` paragraph and offers the `/background` destination
- [x] 7.10 Confirm `/background` returns 200 with scripting unavailable, with both timelines fully present
- [x] 7.11 Inspect the client bundles and confirm no experience or qualification value appears in any chunk under `.next/static/chunks`
- [x] 7.12 Confirm `components/ui/` gained no file and no primitive carries the vocabulary of an experience or a qualification
- [x] 7.13 Run `openspec validate --specs --strict` and confirm every spec still passes
- [x] 7.14 Record in the archive notes that `track` is empty on 14 rows and that `lessonsLearned`, `systems`, and `caseStudies` ship empty, so the omissions read as decisions

## Implementation notes

Recorded so the gaps read as decisions at archive time rather than as oversights.

- **`track` is empty on 14 of 20 rows.** Six are authored here — the two internships as
  `professional`, the four hackathon entries as `technical`. The other fourteen span
  community leadership, event operations, and technical directorship in ways the other
  columns do not settle, so they ship unclassified and render in the group that claims no
  kind. Deciding which is which is the owner's account of their own history. `track` is
  optional precisely so this is a legal state: a required field would have forced a guess,
  and a guess presented as the owner's decision is worse than an acknowledged gap.
- **`lessonsLearned` ships empty on all 20 rows.** The column is declared and validated,
  and no value was written. A lesson learned is a retrospective judgement about work that
  was really done; authoring twenty of them would have been inventing the owner's
  reflections, and the column would have looked populated while saying nothing true.
- **`systems` ships empty on all 20 rows.** Declared as a technology reference, so a value
  must name a record in `technologies.csv`. Naming a system an operation ran on is a
  factual claim about infrastructure and is not derivable from the other columns.
- **`caseStudies` ships empty on all 20 rows,** so the related-work region renders nothing
  for every experience. The read path is implemented on both sides: the experience resolves
  its `caseStudies` references to `CaseStudy` records in `assemble()`, and each case study's
  reverse `experiences` view is derived from them. Populating the column later needs no code
  change. Which role evidences which project is the owner's account to make.
- **Three kinds of work hold no recorded experience** — `leadership`, `community`, and
  `event-operations`. They stay in the vocabulary because the content plainly needs them and
  each excludes something; they are declared on the page by the content model and asserted
  against the vocabulary. `experiencesByTrack()` omits an empty group rather than rendering a
  heading over nothing, so the shipped page shows three groups, not five.
- **`responsibilities` is 1 of 20 and `tools` is 4 of 20,** unchanged by this migration.
  Every optional region is therefore omitted when its record declares nothing, which is the
  common case. Fourteen entries render as span, organisation, role shape, location, and the
  owner's own account of the work — never as a bare date range, since `description` is 20 of 20.
- **Task 1.7's seventh slug was corrected during implementation.** The task listed
  `gdgc-cam CTO` for the Google Developer Groups on Campus PUP CTO record. That value cannot
  ship: the `slug` field kind rejects a capital letter and a space, which is what makes an
  anchor typeable and stable. Shipped as `gdgc-pup-cto`, derived from the organisation and the
  role exactly as the task's stated rule requires. The remaining nineteen slugs are the ones
  the task named or specified.
- **The terminal's `experience` command prints `track` rather than `type`.** It previously
  printed the column this change removes, so the record would have failed to resolve without
  the edit. An unclassified record prints `unclassified` rather than an empty value, so the
  row does not read as a formatting slip. No behaviour a visitor depended on changed: the
  command still lists every record and still reports the same count.
- **The content file rewrite was verified against the pre-change field counts** rather than
  by eye, since `content/` is untracked and has no committed baseline: `endDate` 15/20,
  `responsibilities` 1/20, `tools` 4/20, `systems` 0/20, `caseStudies` 0/20, and every other
  column 20/20 — all matching the figures the design recorded for the file before the change.
- **The page renders the groups, not a flat list plus the groups.** An earlier draft rendered
  every entry twice, once ungrouped and once in its group, which would have duplicated every
  anchor id on the page. The groups are the timeline; the empty state is reached only when
  `experiencesByTrack()` returns no groups at all.
- **Ordering is asserted as a property, not by re-implementing the comparator.** The cases in
  `background.test.ts` check each adjacent pair against the stated rule — open period first,
  then end descending, then start descending, then slug ascending. A second copy of the sort
  in the test would have passed whenever the two agreed, including on the day they both
  drifted.