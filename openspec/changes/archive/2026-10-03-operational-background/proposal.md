## Why

Twenty experience records and three education records exist in the content model, and
almost none of them are reachable. Experiences render only as a related-records block on
a case-study page and as a list in the terminal; education renders as a three-column card
grid on the landing page. Neither has a page of its own, so the record that most
demonstrates operational depth — twenty roles across community leadership, cloud
directorship, event operations, and internships — is the record a visitor is least able to
read.

The data is already close to what an operational history needs and already partly wasted.
`responsibilities` is populated on 1 of 20 rows, `tools` on 5, `systems` on 0, and
`caseStudies` on 0, so four columns exist to carry detail that nothing has yet put in them.
The `type` column meanwhile carries `organizational` for 14 of 20 rows, which collapses
community work, event operations, and technical directorship into one value a reader cannot
use.

## What Changes

- **BREAKING** — Replace the `type` column on `content/experiences.csv` with `track`,
  declared as `professional`, `technical`, `leadership`, `community`, or
  `event-operations`. All 20 rows are rewritten. `organizational` and `competitive` are
  removed: the first merged four distinct kinds of work into one unreadable value, and the
  second is covered by `technical`.
- **BREAKING** — Give `content/experiences.csv` a `slug` and make it the identifier, so an
  experience has a stable address rather than one derived from its title. 20 rows rewritten.
- Add an optional `lessonsLearned` column, declared and shipped empty. `description` already
  carries the operational account — what was actually done, in the first person — so it is
  kept and not duplicated.
- Add `/background`, carrying an education timeline and an experience timeline grouped by
  `track`, ordered most recent first. One route, one navigation entry.
- Present the timeline as operational history: each entry shows its span, organization,
  role shape, what was operated, what it was operated with, and what it taught — not a
  list of titles and employers.
- Resolve the existing `caseStudies` column into a linked case-study region per entry, in
  the direction the case-study page already reads.
- Add one `/background` entry to the shared navigation definition. Individual entries are
  addressed but never enumerated in navigation.

## Capabilities

### New Capabilities
- `background`: The `/background` route and everything it presents — the education
  timeline, the experience timeline grouped by track, the operational detail each entry
  shows, the case-study links, and the ordering both timelines use.

### Modified Capabilities
- `content-model`: The experience collection's `type` column is replaced by `track` with a
  declared five-value set, the collection gains a `slug` identifier and a `lessonsLearned`
  field, and the requirement that classification uses declared taxonomies gains the track
  instance. The education collection gains the ordering and field vocabulary its timeline
  needs.
- `home-page`: The landing page's education summary becomes a pointer into the timeline
  rather than a second, differently-arranged presentation of the same three records.

## Impact

- **Content** — `content/experiences.csv` gains `slug`, `track`, and `lessonsLearned`, and
  all 20 rows are rewritten. `slug` and `track` are authored in this change from what the
  existing columns already imply; `lessonsLearned` ships empty.
- **Schema** — `lib/content/schema.ts` gains `EXPERIENCE_TRACKS`, drops
  `EXPERIENCE_TYPES`, and gains three field declarations on `EXPERIENCE_SCHEMA`.
- **Model** — `lib/content/model.ts` carries `slug`, `track`, and `lessonsLearned` on
  `Experience`, and gains ordered accessors for both timelines.
- **Routes** — `app/background/page.tsx`, server-rendered.
- **Components** — `components/background/` for the two timelines and the entry layouts.
  No new primitive; `components/ui/` is untouched, because a primitive must not carry the
  vocabulary of an experience or a qualification.
- **Navigation** — one entry in `lib/navigation.ts`.
- **Landing page** — `components/sections/education-summary.tsx` is reduced to a pointer.
- **Unaffected** — no dependency is added; runtime packages remain `next`, `react`,
  `react-dom`. No design token is added. Case studies and credentials are untouched, though
  both read the relationships this change surfaces.

## Non-goals

Each of these is named so its absence reads as a decision rather than an oversight.

- **Writing `lessonsLearned` for the 20 rows.** The column is declared and validated and
  ships empty. A lesson learned is a retrospective judgement about work that was really
  done; authoring twenty of them would be inventing the owner's reflections, and the column
  would look populated while saying nothing true.
- **Classifying the 14 `organizational` rows into tracks.** The two internships are plainly
  `professional` and the four hackathon entries are plainly `technical`, so those six are
  authored in this change. The remaining fourteen span community leadership, event
  operations, and technical direction in ways the existing columns do not settle. They ship
  with an empty track and render ungrouped; deciding which is which is the owner's call
  about their own history.
- **Populating `caseStudies`.** The column exists and is empty on all 20 rows. The read
  side is built so filling it later needs no code, but which experience evidences which
  project is not derivable.
- **Populating `systems`.** Declared as a technology reference and empty on all 20 rows.
  Naming a system an operation ran on is a factual claim about infrastructure.
- **Per-entry detail pages.** Every entry is addressable by anchor, not by route. Twenty
  routes for twenty records, most of which are a paragraph and a date range, is a page per
  entry with no content to justify it.
- **A duration or tenure figure.** Computed spans are the kind of derived statistic this
  site states only where it can be checked against the content, and a total-years figure
  across overlapping roles would be a sum of overlapping intervals.
- **Ordering or filtering controls on `/background`.** Twenty entries grouped by five tracks
  is legible without them, and either control would need a query string or a client boundary
  on a page that is otherwise entirely server-rendered.