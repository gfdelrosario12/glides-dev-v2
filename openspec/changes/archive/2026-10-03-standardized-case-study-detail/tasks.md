## 1. Declare the ten-section structure

- [x] 1.1 Add `CASE_STUDY_SECTIONS` (overview, problem, architecture, implementation, infrastructure, security, challenges, results, lessonsLearned, technologies) and the derived `CaseStudySection` type to `lib/content/schema.ts`, with each entry's label
- [x] 1.2 Replace `NARRATIVE_SECTIONS` in `lib/content/model.ts` with a read of that declaration, keeping the same labels for the nine existing sections and adding `Technologies`
- [x] 1.3 Confirm no component, route, or validator holds its own list of section names — every section name resolves to the one declaration
- [x] 1.4 Confirm `npm run build` is unchanged by 1.1–1.3: the same nine sections render in the same order and Technologies is not yet rendered

## 2. Add the new field kinds

- [x] 2.1 Add a `sectionRef` field kind to `FieldKind` in `lib/content/schema.ts`, resolving against `CASE_STUDY_SECTIONS` keys and failing with the permitted values listed
- [x] 2.2 Handle `sectionRef` in `checkField`, following the `slugRef` pattern for the failure message rather than reusing `oneOf`
- [x] 2.3 Add a `code` field kind that accepts a present value without trimming it, fails only when the value is empty, and is the only kind that exempts snippet text from ingest normalisation
- [x] 2.4 Add cases to `lib/content/schema.test.ts` for `sectionRef` (valid, unknown, empty) and for `code` (whitespace preserved, empty rejected, internal newlines preserved)
- [x] 2.5 Run `node --test lib/content/*.test.ts` and confirm every case passes

## 3. Register the snippet collection and extend media

- [x] 3.1 Add `CASE_STUDY_SNIPPET_SCHEMA` to `lib/content/schema.ts` with `slug` (`slugRef`), `section` (`sectionRef`), `language`, `caption`, `order` (`orderIndex`), and `code` (`code`)
- [x] 3.2 Register the collection in `COLLECTION_SCHEMAS` and add `content/case-study-snippets.csv` containing only its header row
- [x] 3.3 Add `section` (`sectionRef`), `kind` (`oneOf` over `diagram` and `photo`), and `caption` to `CASE_STUDY_MEDIA_SCHEMA`, plus a `MEDIA_KINDS` declaration
- [x] 3.4 Update `content/case-study-media.csv` with the three new columns; the file has no rows, so only the header changes
- [x] 3.5 Run `npm run build` and confirm it passes — an empty snippet collection and an empty media collection are both valid, and no existing case study is affected

## 4. Resolve sections, media, and snippets onto the record

- [x] 4.1 Add a resolved per-section view to `lib/content/model.ts`: for each declared section a case study populates, its prose, its media in declared order, and its snippets in declared order
- [x] 4.2 Expose the tenth section from the case study's resolved technology records rather than from prose, so it is never a second place the same fact is written
- [x] 4.3 Add the case study's media and snippets to the exposed `CaseStudy` record so consumers receive records rather than reference strings
- [x] 4.4 Confirm every case study's nine existing sections still resolve, and that a record with no snippets has an empty snippet list rather than an absent one
- [x] 4.5 Run `npx tsc --noEmit` and `npm run build`

## 5. Enforce completeness on publication

- [x] 5.1 Add a cross-record validator to `lib/content/validate.ts` that walks every case study declaring `published` and accumulates, per record, every missing section and whether any technology is declared
- [x] 5.2 Make it exempt drafts entirely, so a draft with no sections validates
- [x] 5.3 Throw once with all accumulated failures, naming each record and every section it is missing, following the existing `failures[]` accumulation in that file
- [x] 5.4 Add cases to `lib/content/schema.test.ts` or a new `lib/content/completeness.test.ts` covering a published record missing one section, missing several reported together, missing a technology, a complete record passing, and a draft missing everything passing
- [x] 5.5 Run `node --test lib/content/*.test.ts`
- [x] 5.6 **Expect `npm run build` to fail at this point, by design.** Record the failure output naming all seven case studies and their missing sections, and confirm the message is actionable rather than a stack trace

## 6. Owner content decision

- [x] 6.1 For each of the seven case studies, either write its nine sections and keep it `published`, or set it to `draft` until they are written
- [x] 6.2 Confirm no section is authored by the system, and that any prose added is the owner's own account of the work
- [x] 6.3 Run `npm run build` and confirm it passes once every published record satisfies the rule

## 7. Build the section layout

- [x] 7.1 Create `components/case-study/section-block.tsx` rendering one section: its heading, its media, its prose, and its snippets, in that order, with each part omitted when absent
- [x] 7.2 In `section-block.tsx`, render a diagram full-measure before the prose and photographs in a two-column grid, deciding placement from the declared `kind` rather than from anything inferred
- [x] 7.3 Create `components/case-study/snippet.tsx` rendering the language label, the optional caption, and the code body with `whitespace-pre`, inside a `min-w-0` container with `overflow-x-auto`
- [x] 7.4 Style `snippet.tsx` with the roles in design decision D8 — `bg-surface-inset`, `text-text`, `text-text-muted` for the labels, `border-border`, `rounded-sm`, `text-code` — and add no token
- [x] 7.5 Give each snippet's code an accessible name that identifies its language, and confirm a snippet is readable with the alternative text a screen reader receives
- [x] 7.6 Reduce `app/projects/[slug]/page.tsx` to the shell, the summary, a loop over the declared sections rendering `SectionBlock`, and the related records — removing the flat `Media` component
- [x] 7.7 Confirm the route still generates only published slugs and still returns the not-found response for an unrecognised or unpublished slug
- [x] 7.8 Confirm the ten sections render through one code path, so adding a section needs no new component

## 8. Tests

- [x] 8.1 Add a case asserting a media record with no `section` or no `kind` fails validation, and one naming a section outside the declared set
- [x] 8.2 Add a case asserting snippet text is stored with its indentation and blank lines unchanged, and that the stored text equals the declared text byte for byte
- [x] 8.3 Add a case asserting snippet whitespace is not normalised on ingest while another field's value still is
- [x] 8.4 Add a case asserting an empty snippet collection and an empty media collection both validate
- [x] 8.5 Run `node --test lib/content/*.test.ts` and confirm every case passes

## 9. Verify

- [x] 9.1 Run `npm run lint`
- [x] 9.2 Run `npx tsc --noEmit`
- [x] 9.3 Run `npm run build`
- [x] 9.4 Confirm the build output still shows all published slugs prerendered and no route added by hand
- [ ] 9.5 Fetch a complete case study and confirm all ten sections appear in the declared order, with a diagram ahead of the Architecture prose when one is declared
- [x] 9.6 Confirm a section with no media, no snippets, or neither renders no empty region and no placeholder heading
- [ ] 9.7 Fetch a case study with snippets and confirm indentation, blank lines, and characters that would be markup all render literally
- [ ] 9.8 Fetch a case study with a snippet containing a long line and confirm the document does not scroll horizontally at a small width
- [x] 9.9 Confirm an unpublished case study returns the not-found response and appears in no listing or figure
- [x] 9.10 Inspect the client bundle and confirm it contains no snippet text and no section prose
- [x] 9.11 Run `openspec validate --specs --strict` and confirm all specs still pass
## Verification status

Verified against the built site on 2026-10-03. Every check below was run; none is
recorded from expectation.

- 9.1 `npm run lint` — clean.
- 9.2 `npx tsc --noEmit` — clean.
- 9.3 `npm run build` — passes. It failed by design before the content decision in
  task 6.1 and passes now that every record is `draft`.
- 9.4 Build output shows `/projects` as `ƒ` and `/projects/[slug]` as `●`, so the
  detail route still goes through `generateStaticParams`. Zero slugs are
  prerendered, which is what zero published records means. No route was added by
  hand; the route table still lists six entries.
- 9.6 Verified at the layer the decision lives in, not by fetch: `sectionsOf`
  returns nothing for a record that declares nothing, and the route omits the
  region entirely when that is empty, so no empty region and no placeholder
  heading can be produced. Asserted in `lib/content/sections.test.ts`. No page was
  fetched, because no case study is published and therefore none exists to fetch.
- 9.9 All seven slugs return 404, as does a slug no record claims, and none of the
  seven appears in `/projects`. Checked over HTTP against `next start`.
- 9.10 No `use client` in `app/projects`, `components/case-study`, or
  `lib/content`. No content string appears in any chunk under `.next/static/chunks`.
- 9.11 `openspec validate --specs --strict` — 8 passed, 0 failed.

### Not yet verifiable

These three need published content that does not exist, and task 6.2 forbids the
system authoring it. They are left unchecked rather than assumed.

- 9.5 Declared order is asserted by unit test, but "a diagram ahead of the
  Architecture prose when one is declared" has never been rendered, because
  `content/case-study-media.csv` holds only its header. Verified when the first
  sectioned case study is published with a diagram.
- 9.7 Byte-exact ingest is proven by test, including the leading space and trailing
  newline that a trimming parser would have taken, but nothing has been fetched to
  confirm the rendered page shows indentation, blank lines, and markup characters
  literally. Verified when the first snippet is published.
- 9.8 Needs a snippet with a line long enough to overflow. `min-w-0` and
  `overflow-x-auto` are present on the scroll container, but no horizontal-scroll
  check has been made at a narrow viewport because no snippet exists.

Writing the sections is the owner's task. Once one case study has its nine sections
and `status` returned to `published`, the build enforces the rest and these three
close.
