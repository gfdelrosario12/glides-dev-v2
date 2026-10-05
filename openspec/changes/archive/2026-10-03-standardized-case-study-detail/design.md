## Context

See `proposal.md` — Why for motivation, and `specs/` for the requirements this design implements.

The state that shapes every decision here:

- **All seven case studies are `published`, and 0 of their 63 narrative section cells are populated.** `case-study-media.csv` is a header row with no records. A completeness gate therefore fails the build immediately, not eventually.
- **Nine of the ten sections already exist** as `NARRATIVE_SECTIONS` in `lib/content/model.ts:127`, in fixed order. Technologies does not, and is the only section whose body is derived records rather than authored prose.
- **The content model has no whitespace-preserving field.** `Headers and field values are normalised on ingest` in `openspec/specs/content-model/spec.md` trims every value. Code is the one content kind where a trimmed space changes meaning, so ingest is where this change has to make an exception — and it has to make it by field, not globally.
- **`generateStaticParams` already generates routes from published slugs**, so "generate routes dynamically from case-study slugs" is existing behaviour. This design adds the slug-agnostic layout beneath it, not a routing change.
- **Zero runtime dependencies.** `next`, `react`, `react-dom` only. No highlighter, no diagram library, no markdown parser.
- **CSV is RFC 4180.** I verified the parser on this before designing against it: a quoted cell survives embedded newlines unchanged, and `""` round-trips to a literal `"`. A snippet containing `function f() { return "hi"; }` round-trips byte-identically when the quotes are doubled, and a cell written as `\"` fails loudly with a position rather than parsing to something different.

## Goals / Non-Goals

**Goals:**

- One declared section set that rendering, media, snippets, and the completeness rule all read.
- A layout driven by that set, so a new section is a one-word edit and not a new component.
- Snippets rendered byte-faithfully, with no transform of any kind.
- Diagrams presented ahead of the Architecture prose at a distinguishable measure.
- Every violation of a new rule reported in one build, not one per build.

**Non-Goals:**

- Syntax highlighting, copy-to-clipboard, or any client component on a content page.
- A diagram data model, SVG rendering, or any image processing.
- Authoring any of the missing prose. The gate makes its absence loud; nothing here fills it.

## Decisions

### D1 — The section set is declared once, and every section reference is checked against it

`lib/content/schema.ts` gains the declaration, beside `PROJECT_CATEGORIES` and `CASE_STUDY_DOMAINS`:

```
export const CASE_STUDY_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'problem', label: 'Problem' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'implementation', label: 'Implementation' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'security', label: 'Security' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'results', label: 'Results' },
  { key: 'lessonsLearned', label: 'Lessons learned' },
  { key: 'technologies', label: 'Technologies' },
] as const;
export type CaseStudySection = (typeof CASE_STUDY_SECTIONS)[number]['key'];
```

This replaces `NARRATIVE_SECTIONS` in `lib/content/model.ts`, which holds the same nine entries inline. The array is the single list; the type is derived from it, so a key that is not declared is a compile error.

Section references on media and snippets use a new field kind `sectionRef`, mirroring how `slugRef` resolves a case study and `slugRefList` resolves several. It is a distinct kind from `oneOf` because the error message matters: a bad section should report the permitted sections, the same way a bad slug reports its collection.

*Alternative rejected:* leave sections as loose CSV columns and validate by hand-written list. Rejected — that is the second declaration this design exists to prevent, and it would let a section name be added to the CSV without ever being renderable.

*Alternative rejected:* one field per section (`architectureDiagram`, `codeSnippet`, …) rather than a `section` reference. Rejected — it makes every new media kind a schema change, and it puts section names into column headers where they cannot be validated as a set.

### D2 — Technologies is the tenth section, satisfied by records rather than prose

The tenth entry is keyed `technologies`, and its body renders the case study's resolved technology records — the same `technologies` list the "At a glance" facts already use. It is not an authored paragraph, so the completeness rule treats it differently from the other nine: nine require prose, Technologies requires at least one declared technology.

*Why this is stated explicitly.* If all ten were treated as prose, the gate would demand a paragraph about technology choices that duplicates data the model already holds, and the author would have to write the same information twice in two forms that could disagree. Stating the asymmetry is what stops a later change from "fixing" the inconsistency.

### D3 — The completeness rule collects every violation and fails once

A cross-record validator in `lib/content/validate.ts`, beside `validateRelations`, walks every case study that declares `published` and accumulates failures rather than throwing on the first. Each failure names the file, the record, and every missing section, so a case study missing four sections is one build and one fix, not four.

The existing per-field validation already collects into `failures[]` and throws once (`lib/content/validate.ts:183`), so this follows the established shape rather than introducing a second error-accumulation idiom.

*Why not fail on the first record?* Because the seven records are independent: stopping at the first would mean up to seven build-and-fix cycles before anything could be published.

### D4 — Snippets are a new collection; code is a quoted cell whose whitespace is preserved

`content/case-study-snippets.csv`, registered as a collection exactly like `case-study-media.csv`:

| Field | Kind | Required |
| --- | --- | --- |
| `slug` | `slugRef` → case studies | yes |
| `section` | `sectionRef` | yes |
| `language` | `text` | yes |
| `caption` | `text` | no |
| `order` | `orderIndex` | yes |
| `code` | `code` (new kind) | yes |

The `code` kind exists for one reason: `checkField` trims every value, and a trailing newline or a space that indents a block is content in code. `code` returns `null` for a present value without touching its whitespace, and fails only when the value is empty — so a snippet cannot be declared and then render as nothing. Verified against the parser: a doubled-quote cell round-trips byte-identically, and `\"` fails the build with a position rather than silently changing the text.

*Alternative rejected:* a `sections` collection holding both prose and code blocks as a discriminated `kind` column. Rejected — it would move every existing narrative section out of `case-studies.csv`, rewriting a file that is otherwise unchanged, for no gain over a separate snippet collection.

### D5 — Media becomes section-scoped, and the flat media region goes away

`case-study-media.csv` gains `section` (`sectionRef`, required), `kind` (`oneOf` over `diagram` and `photo`, required), and `caption` (`text`, optional). The existing `slug`, `src`, `alt`, `order` fields are unchanged.

The `Media` component in `app/projects/[slug]/page.tsx` — a single region of images gathered after the narrative — is removed. Media now renders inside the section that declares it, which is what lets the diagram rule below apply to Architecture specifically rather than to a generic gallery. The file currently has zero records, so no existing row is rewritten.

### D6 — Diagrams lead their section, and the kind decides the measure

A section renders its declared media as follows:

- **Diagram** — full measure of the section, before the prose.
- **Photo** — a two-column grid with the other photographs in that section.

A case study with no media for a section renders no media region and no placeholder. A diagram declared for a section other than Architecture gets the full measure too; what is special about Architecture is only that the diagram precedes the prose.

*Alternative rejected:* inferring `diagram` from the file name or path. Rejected — that is classification by guesswork, and the kind is one cell of one row.

### D7 — The page is composed by one section layout, not ten inline components

`app/projects/[slug]/page.tsx` currently holds ten inline components — `Facts`, `Destinations`, `Media`, `Related`, and the section loop inline. This change adds `components/case-study/section-block.tsx`, which renders one section: its heading, its media, its prose, and its snippets. The route maps over `CASE_STUDY_SECTIONS` and renders a `SectionBlock` for each declared section, so the ten cases share one code path.

Media and snippets reach the section through the model, not through props threaded from the route: `sectionsOf(caseStudy)` returns, per declared section key, the prose, the media, and the snippets. A section key with prose but no media is not a different object from one with both.

*Why not a new design-system primitive?* `components/sections/chip.tsx:6` sets the precedent that a helper serving one surface is not a primitive, and `ui-primitives` requires every primitive to be domain-agnostic — a primitive that knew what a case-study section was would not be. Everything composes the existing `Card`, `TokenChipList`, `Metadata`, and `Button`.

### D8 — Snippet rendering preserves whitespace and never transforms it

Tokens, all declared in `app/globals.css` inside `@theme` and reached by role:

| Role | Token | Value | OKLCH | Measured contrast |
| --- | --- | --- | --- | --- |
| Snippet fill | `surface-inset` | `#1A1D22` | `oklch(0.230 0.011 261)` | — |
| Snippet text | `text` | `#E8EAED` | `oklch(0.936 0.005 258)` | 14.02:1 on `surface-inset` |
| Language and caption label | `text-muted` | `#868E9A` | `oklch(0.644 0.020 258)` | 5.11:1 on `surface-inset` |
| Snippet edge | `border` | `#262A31` | `oklch(0.284 0.014 262)` | decorative hairline; no ratio claimed |
| Snippet radius | `radius-sm` | `4px` | — | — |
| Snippet inset | `spacing` × 3 | `0.75rem` | — | — |
| Snippet type | `text-code` / `font-mono` | `0.8125rem` / `1.6` | — | — |

No token is added. `--text-code` already exists at exactly this size for exactly this purpose and was previously unused outside the terminal.

The code body renders with `whitespace-pre` so every space and line break survives, inside a container with `min-w-0` and `overflow-x-auto` so a long line scrolls within the block rather than widening the document. `min-w-0` is already the codebase's answer to grid children refusing to shrink, and `wrap-anywhere` is a Tailwind v4 built-in — neither is newly defined here.

No syntax highlighting: it needs a highlighter dependency and either a client boundary or a build-time transform, and the site's content pages have neither. No copy button: it needs `navigator.clipboard` and client state. The cost is that reading code is plain text; the benefit is that no transformation can alter the author's code.

### D9 — No new dependency

Nothing here needs one. The diagram is an image the owner supplies. Code is `<pre>`-shaped text. The section set is an array. Adding a highlighter or a diagram library would be the only way to make this change worse.

## Risks / Trade-offs

- **The build is red the moment this merges.** Seven published records declare zero sections. → This is the gate working, not a defect, and the first migration step is an explicit owner decision per record: write the nine sections, or set the record to `draft` until they are written. A draft is unbuildable-safe, unreachable, and uncounted, so a record can be parked without lying about it. The change cannot land green on its own, and pretending otherwise would mean weakening the gate the owner asked for.
- **Authoring code in CSV is quote-dense.** Every `"` in a snippet becomes `""`. → Mitigated by the parser failing loudly with a file and position rather than silently changing the text, verified above. A snippet file is the right trade while the content is prose-and-diagram shaped; a repository of snippets would justify leaving CSV.
- **Whitespace-preserving ingest is a field-level exception to a global normalisation rule.** → Scoped to the one field kind that needs it. Normalising every other value is unchanged, and the exception is a named kind rather than a flag, so no other field can acquire it by accident.
- **The completeness rule couples content editing to build success.** A half-written case study cannot be merged while published. → Intended, and the draft escape exists precisely so that writing is still possible in small increments.
- **A section gains no per-case-study customisation.** → Deliberate. Two case studies that need different section shapes need different changes, not a layout that grows conditionals.
- **Media stops being a gallery.** A visitor can no longer see every image in one place on the page. → Accepted: a figure separated from the argument it supports is the arrangement this change exists to remove.
- **The gate covers structure, not quality.** Ten declared sections can all be one sentence. → Stated so it is not mistaken for more than it is. The content model cannot assess prose, and a gate that tried would be inventing an editorial standard.

## Migration Plan

1. Add `CASE_STUDY_SECTIONS` to `lib/content/schema.ts`, replace `NARRATIVE_SECTIONS` in `lib/content/model.ts` with a read of it, and register the new `sectionRef` and `code` field kinds.
2. Add `case-study-snippets.csv` with its header row and no records, and register the collection.
3. Add `section`, `kind`, and `caption` to `case-study-media.csv`. The file has no rows, so this is a header change.
4. Implement `sectionsOf(caseStudy)` and the completeness validator, accumulating all failures.
5. **Owner decision, per record.** Either write the nine sections and keep `published`, or set `draft`. Until this is done for all seven, `npm run build` fails, and it names each record with every section it is missing.
6. Build `components/case-study/section-block.tsx` and reduce the route to the shell, the summary, the section loop, and the related records.
7. Populate media and snippets as content is authored; neither collection needs a row for the build to pass.
8. Verify with `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `node --test lib/content/*.test.ts`.

**Rollback.** Every step is additive. Reverting drops the new collection, the three media columns, the section layout, and the completeness validator, restoring the flat media region and the optional-sections behaviour. No published address changes. `content.pre-portfolio-content-model/` remains the pre-migration rollback copy of the CSVs as it was before the content model landed.

## Open Questions

None. The three decisions that would have changed the design — how completeness is enforced, how snippets are authored, and how a diagram is represented — were settled before this document was written. What remains is content the owner writes, which is sequencing rather than design.