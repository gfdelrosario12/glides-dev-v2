## Why

The content layer can count what it holds but cannot say anything true about it. A project is
eight columns wide — no year, no role, no publication status, no account of what was built or
learned. An experience is one free-text `duration` string plus a single prose blob, which is why
the build already reports that one duration "ends before it begins". A certification is a year and
a link, with no issuer distinct from the title, no expiry, no credential identifier, and nothing
connecting it to work that used it. The result is a portfolio that displays totals accurately and
asserts very little per record — and a `project-detail` capability that defines a case study as one
optional prose blob, which is the one shape that cannot be validated, queried, or cross-referenced.

The terminal made the gap concrete. It is specified to navigate only to a published case study and
degrades honestly because nothing in the content declares what is published: publication is a
hardcoded empty list in the terminal's own source.

Underneath that sits a larger gap. The `project-detail` capability has 9 fully specified requirements
and **no implementation at all** — there is no `app/projects/[slug]/page.tsx`, and
`lib/terminal/commands.ts:34` records why: the published list is "Empty until `/projects/[slug]`
ships". So a publication status would be a claim nothing could check, and the terminal's `open` would
navigate to a 404. This change therefore builds the route as well as the content it renders.

## What Changes

- **`CaseStudy` replaces `Project`** as the content record, widening it from 8 to 20 fields: adds
  `year`, `role`, `status`, and the narrative sections `overview`, `problem`, `architecture`,
  `implementation`, `infrastructure`, `security`, `challenges`, `results`, `lessonsLearned`, plus
  `media` and a typed `externalLinks` collection. `techStack` becomes a declared `Technology`
  reference rather than a list of free-text strings.
- **`CaseStudy.status` decides publication.** A draft case study has no address, is absent from the
  terminal's `open`, and is excluded from published counts. All 7 existing records are seeded
  `published` — an owner decision, since nothing in the repository records which case studies are
  finished — which makes the 7 `/projects/<slug>` addresses resolve for the first time and leaves the
  displayed count at 7.
- **`Certification` gains the fields a credential actually has**: `issuer` distinct from `title`,
  an acquisition date, an `expiration` where the credential lapses, a `verificationUrl`, an
  optional `credentialId`, and references to the case studies it relates to. The inert `color`
  column is removed rather than kept as a validated-but-unused field. The two Credly records carry a
  badge identifier inside their existing URL, so `credentialId` is populated for exactly those two
  and left absent for the other four.
- **`Experience` gains `role` distinct from `title`, structured `startDate`/`endDate` replacing the
  free-text `duration`, a `category`, discrete `responsibilities`, `tools`, and `systems`
  collections, and references to related case studies.** A present role leaves `endDate` absent
  rather than carrying an open-ended marker string. Its existing `skills` list is left as free text:
  17 of its 20 values are capabilities rather than technologies, and the focus-area requirements
  match signals against exactly those tokens.
- **`Education` gains a `degree`/`field` distinction and structured dates**, replacing the free-text
  `period`. `degree` is optional, because one record states a strand rather than a degree level.
- **Three new models.** `Profile` becomes one record rather than six loose constants in the identity
  module. `Technology` becomes a first-class record with a canonical name, category, and aliases, so
  "unique technology count" counts identities rather than spellings. `SocialLink` moves out of the
  navigation definition into content, carrying a platform, a handle, and whether it leaves the site —
  collapsing the second, independent declaration of GitHub and LinkedIn that `content/site.ts`
  currently holds.
- **Cross-references are declared and validated.** A case study named by a certification or an
  experience must exist, and the reference resolves to the record rather than to a string.
- **Statistics are reworked to match.** `caseStudyCount` counts published case studies;
  `uniqueTechnologyCount` counts canonical technology identities. That figure moves from 16 to 19,
  because `Google Cloud`, `Microsoft Azure`, and `Flutter` are technologies the portfolio records and
  the count never saw; the change is reported with a per-record reason, not silently accepted. No new
  statistic is authored anywhere.
- **The case-study route is created.** `app/projects/[slug]/page.tsx` is added as a server component
  that renders the not-found response for an unrecognised or unpublished slug, presents the declared
  fields, narrative sections, media, related records, and external destinations, and enumerates the
  published slugs. Publication status would be meaningless without it.
- **The terminal's hardcoded published-slug list is deleted** and replaced by the derived status, so
  `open` is driven by the same declaration that decides whether a page exists.
- **New fields are validated as strictly as required ones whenever they are present, and are optional
  unless there is a reason for them not to be.** `status` is the one required new field: a case
  study's visibility must be stated, not defaulted. Fields the current data supports — year, role,
  structured dates, technology references — are populated now; narrative sections and media stay
  absent and render nothing.

**BREAKING**: the content model is renamed `Project` → `CaseStudy` and `Qualification` →
`Education`, the `duration` and `period` columns are replaced by date columns, and `techStack`,
`color`, and `badgeColor` columns are removed. Every consumer of the model changes with it.

## Capabilities

### New Capabilities

None. The three new models belong to the existing content layer rather than to a capability of
their own: a second capability would leave two specs describing the same records.

### Modified Capabilities

- `content-model`: the record shapes for case studies, certifications, experience, and education;
  the new `Profile`, `Technology`, and `SocialLink` models; declared cross-references between
  records; publication status and its effect on derived statistics; structured dates replacing
  free-text durations; and the reworked statistics interface.
- `project-detail`: the case-study page presents the structured narrative sections instead of a
  single `detail` prose blob; a draft case study has no address; external links and media come from
  the model. The capability is specified but unimplemented, so this change also delivers the route
  those requirements describe.
- `terminal`: `open` resolves published slugs from the content model's publication status instead of
  a list maintained in the terminal's own source, and the "no case study is published" outcome is
  restated in those terms.

## Impact

- **Content files.** `projects.csv` (7 records, 8 columns), `experiences.csv` (20 records, 9
  columns), `certifications.csv` (6 records, 6 columns), and `education.csv` (3 records, 6 columns)
  are restructured, and `technologies.csv`, `social-links.csv`, and `case-study-media.csv` are added.
  The `duration` value at `experiences.csv` line 12 — currently reported as uninterpretable — is
  corrected in the data rather than worked around.
- **Code.** `lib/content/` gains the new record types, the required/optional dimension, field kinds for
  dates and cross-references, and the `Technology`/`Profile`/`SocialLink` models; `derive.ts` gains
  the reworked statistics; `lib/terminal/commands.ts` drops `PUBLISHED_CASE_STUDIES`;
  `lib/navigation.ts` and `content/site.ts` read `SocialLink` from content instead of declaring it;
  `lib/terminal/registry.ts` follows the rename.
- **Routes.** `/projects/[slug]` is **added** — the route does not exist today. It gains the
  narrative sections, media, and related records, returns the not-found response for a draft slug,
  and resolves for all 7 slugs. The route table gains exactly one entry; no existing route changes.
- **Dependencies.** None added. The validation layer gains field kinds, not packages.
- **Not touched.** The token layer, the shell, typography, and the design primitives. Nothing in this
  change introduces a colour, spacing step, radius, or type step.

## Non-goals

- **Authoring the narrative sections.** `problem`, `architecture`, `challenges`, `results`, and
  `lessonsLearned` are facts about real work. This change ships the fields and populates what the
  data supports; the prose is the owner's to write, as a follow-up data change.
- **Authoring missing credential data.** `expiration` stays absent for all 6 certifications, because
  none of them record one; `credentialId` is populated only where a badge identifier already exists
  in the record.
- **Reclassifying what the owner wrote.** `Version Control Systems` and `IoT` are seeded as
  technology records and classified by `category` as a practice and a field respectively, rather than
  replaced with names the owner never wrote.
- **Media hosting or image optimisation.** `media` is modelled and validated; nothing resizes,
  converts, or serves an image.
- **Search, filtering, or sorting interfaces.** The cross-references exist to be resolved by the
  model and rendered on a case study; no new browse or query surface is introduced.
- **A test runner.** `lib/content/csv.test.ts` exists but the project has no way to run it. This
  change keeps the content layer pure so that adding one is cheap, and does not add one.
