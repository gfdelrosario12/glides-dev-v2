## Why

The background route shipped with 20 experiences and 3 records of study, and the
columns that make it an operational history are almost entirely unwritten: `track` is
empty on 14 of 20 rows, and `lessonsLearned`, `systems`, and `caseStudies` are empty on
all 20. The page therefore renders three of five declared kinds, and the two fields that
would carry what the work was *like* render on no entry at all.

Nothing surfaces this. There is no surface anywhere in the system that reports a content
field as unwritten, so the gaps read as "there is nothing to say" rather than as "there
is something to say and nobody has written it". The `content-model` spec already requires
that the absence of a lesson be "visible to the owner as content to write"; nothing
currently makes it so.

One gap is also blocked in a way that is not visible at all. `caseStudies` is empty on all
20 experiences *and* all 6 certifications, while all 7 case studies are `draft` with 0 of
their 9 prose sections written. Publishing one requires those 9 sections, and an
unpublished case study has no page. So the column cannot be filled until the case studies
are written up, and nothing anywhere reports that dependency.

## What Changes

- **Classify the 8 experiences whose own record decides the kind of work they represent**,
  stated as evidence per row. Three are `leadership`, two are `event-operations`, three are
  `community`. Every declared kind then holds at least one recorded experience, which is
  what the `content-model` requirement that a kind with no recorded experience is not kept
  asks for.
- Declare, per collection, which fields are *authorable* — absent because nobody has
  written them, as distinct from optional fields whose absence is a legitimate stated
  state. `AUTHORABLE_CONTENT` holds that declaration, so the distinction is one the schema
  states rather than something each consumer re-derives.
- Derive a per-collection, per-field account of which records leave an authorable field
  empty, and which fields are empty on every record.
- Add `gaps` to the terminal's declared command set, reporting that account: each field,
  how many records leave it empty, and which records. A server-resolved command, so the
  report reaches the owner without any record entering the client bundle.
- Record that `caseStudies` cannot be filled before case studies are published, and report
  each case study's prose completion in the same command so the blocker is visible with the
  gap it blocks.

## Capabilities

### New Capabilities

None. The worklist is a way of reading existing content, not a behaviour the system did
not have; it adds no route, no navigation entry, and no new content.

### Modified Capabilities

- `content-model`: A field is now declared authorable where its absence leaves content
  unwritten, and the system's account of which authorable fields are unpopulated becomes
  part of the model rather than a figure each consumer counts for itself.
- `terminal`: The declared command set gains `gaps`, which reports the model's account of
  unwritten content and measures only what it names.
- `background`: The experience timeline now presents all five declared kinds, and its
  introduction states the unclassified remainder rather than implying the grouping is
  complete.

## Impact

- **Content** — `content/experiences.csv`: 8 rows gain a `track` value. No other column on
  any file changes. `lessonsLearned`, `systems`, and `caseStudies` stay empty, and this
  change does not write them.
- **Schema** — `lib/content/schema.ts` gains `AUTHORABLE_CONTENT`, keyed by collection and
  naming only fields whose emptiness is an omission. No new field kind, no new token, no
  change to any existing declaration.
- **Model** — `lib/content/model.ts` gains the derivation over `AUTHORABLE_CONTENT` and
  `CONTENT`. `Experience` is unchanged: `track` and `lessonsLearned` are already declared.
- **Terminal** — `lib/terminal/registry.ts` gains one declaration; `lib/terminal/commands.ts`
  gains one resolver. `registry.ts` stays content-free, so the report is server-resolved and
  no content value enters a client bundle.
- **Route** — `app/background/page.tsx` reads the derived account to state the unclassified
  count rather than restating a number it computes itself. No new route, no new navigation
  entry.
- **Unaffected** — `components/ui/` is untouched; the worklist prints terminal lines and
  introduces no primitive. Case studies and credentials are not modified; their emptiness is
  reported, not filled. No dependency is added; runtime packages remain `next`, `react`,
  `react-dom`.

## Non-goals

Each is named so its absence reads as a decision rather than an oversight.

- **Writing `lessonsLearned` on any row.** A lesson learned is a retrospective judgement
  about work that was really done. Authoring even one would be inventing the owner's
  reflection, and a column that looks populated while saying nothing true is worse than an
  empty one. The command makes the twenty unwritten lessons visible so they can be written.
- **Writing `systems` on any row.** Naming a system a role operated is a factual claim about
  infrastructure. Four rows declare `tools` today; promoting a tool to a system would assert
  a different thing — that the role operated it rather than used it — and nothing in the
  record distinguishes those.
- **Filling `caseStudies` on any experience or certification.** All 7 case studies are
  `draft` with 0 of 9 prose sections, and an unpublished case study has no page, so every
  link would 404. The column is reported as blocked by that, with each draft's prose count,
  rather than filled with links that do not resolve.
- **Classifying the 6 remaining unclassified experiences.** `gdsc-pup-mobile-developer`,
  `aws-cloud-clubs-pup-sbd-lead`, `pup-msc-director-cloud-computing`,
  `jug-philippines-student-volunteer`, `kakacomputer-field-ambassador`, and
  `tedxupv-anchored-in-tech-food-volunteer` each have a title or a description that supports
  two or more of the five kinds. Three of them have a title contradicted by their own
  description. Choosing would be picking the owner's account of their own history; they ship
  unclassified and the group shrinks from 14 to 6.
- **Writing case-study prose, or publishing any case study.** 7 records × 9 sections is 63
  authored sections of real technical writing, and it is the owner's account of their own
  work. Reporting how far each draft has got is what this change does instead.
- **Treating every empty optional field as a gap.** `endDate` is empty on 5 experiences
  because those roles are current, `degree` is empty on 1 record of study because it states a
  strand rather than a credential level, and `responsibilities` is empty on 19 because the
  prose does not enumerate discrete items. All three are stated states, and the worklist
  would be noise if it reported them.
- **A build failure for any of these gaps.** They are content to write, not content mistakes.
  Validation already rejects a *bad* value; a field that is absent is a different fault and
  must not fail a build.
- **A route or page for the report.** The terminal is the system's existing surface for
  content questions, and a route would need a navigation entry to be discoverable, which
  would make the navigation item count depend on how much content is unwritten.