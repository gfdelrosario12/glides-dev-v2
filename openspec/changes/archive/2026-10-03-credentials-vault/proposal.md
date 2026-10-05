## Why

Six certifications are recorded in `content/certifications.csv` and rendered in
three unrelated places — a project page's related-records block, the terminal, and a
statistics figure — with no page of their own and no way for a visitor to inspect one.
A credential is the part of a portfolio whose whole value is that it can be checked,
and the current presentation cannot be checked: the destination button is unlabelled,
so a link to a shared LinkedIn certifications list reads exactly like a link to that
specific credential's badge. The model already carries `verificationUrl`,
`credentialId`, `expiration`, and `caseStudies`, and four of the six rows leave them
empty, so the data is being under-used rather than missing.

## What Changes

- **BREAKING** — Add a `slug` column to `content/certifications.csv` and make it the
  identifier for the detail route. Certifications are currently keyed by `title`, which
  contains spaces and commas and would produce percent-encoded addresses that change
  whenever a title is corrected. Every row is rewritten with a slug.
- **BREAKING** — Add a `verificationKind` column declared as `direct` or `profile`, and
  make it required. The value decides the destination's label, so a link to a shared
  profile page is presented as the profile listing it is rather than as verification of
  the credential. No URL is invented and none is removed.
- Add a `skills` column validated against a declared `CREDENTIAL_SKILLS` vocabulary, so
  a credential states what it covers in terms the build checks.
- Add `/credentials`, listing every recorded credential as a card, and
  `/credentials/credential-vault/[slug]` as its detail page.
- Present verification state through the existing `StatusIndicator` primitive: `success`
  for a directly verifiable credential, `warning` for one that expires, with the label
  supplied by the caller so state never rests on colour.
- Resolve the existing `caseStudies` column into a related-case-studies region on each
  detail page, in the direction the case-study page already reads.
- Add one entry for `/credentials` to the shared navigation definition. Individual
  credential pages are addressed but never enumerated in navigation.

## Capabilities

### New Capabilities
- `credentials-vault`: The credential surface — the `/credentials` listing and its cards,
  the `/credentials/[slug]` detail page, the verification state and metadata each
  presents, the declared vocabulary of skills, and the related-case-studies region.

### Modified Capabilities
- `content-model`: The certification collection gains a `slug` identifier, a required
  `verificationKind`, and a `skills` list validated against a declared vocabulary; the
  requirement that classification uses declared taxonomies gains the credential-skills
  instance, and the requirement that records reference each other by identity gains the
  credential-to-case-study relationship read in the reverse direction.

## Impact

- **Content** — `content/certifications.csv` gains three columns (`slug`, `skills`,
  `verificationKind`) and all six rows are rewritten. `slug` and `verificationKind` are
  authored for every row; `skills` is authored by the owner and the column ships empty
  in this change.
- **Schema** — `lib/content/schema.ts` gains `CREDENTIAL_SKILLS`, `CREDENTIAL_VERIFICATION_KINDS`,
  and three field declarations on `CERTIFICATION_SCHEMA`.
- **Model** — `lib/content/model.ts` gains a resolved credential type carrying slug,
  verification kind, skills, and its related case studies, replacing the bare
  `Certification` record as what the vault reads.
- **Routes** — `app/credentials/page.tsx` and `app/credentials/[slug]/page.tsx`, both
  server-rendered, the detail route prerendered from `generateStaticParams`.
- **Components** — `components/credentials/` for the card, the detail body, and the
  verification region. No new primitive: `components/ui/` is untouched, because a
  primitive must not carry the vocabulary of a credential.
- **Navigation** — one entry in `lib/navigation.ts`.
- **Unaffected** — no dependency is added. Runtime packages remain `next`, `react`, and
  `react-dom`. No design token is added.

## Non-goals

These are deliberately deferred, and each is named so the omission reads as a decision
rather than an oversight.

- **Populating `caseStudies`.** The read side is built, but the column ships empty for
  all six rows. Which credential relates to which case study is the owner's account to
  make, and inferring it would assert a relationship the site cannot stand behind. The
  region renders nothing until the column is filled.
- **Populating `skills`.** Same reasoning, and worse: a declared vocabulary has to be
  written before it can be validated, and choosing its members is editorial. The column
  is declared and validated; the values are the owner's.
- **Recording `expiration` dates.** All six rows leave it empty, which the model already
  reads as "does not lapse". No expiry is invented to exercise the warning state. The
  `warning` tone is specified and implemented, but nothing in the current content
  triggers it.
- **A search or filter control over credentials.** Six records do not need one, and it
  would add a client boundary to a page that is otherwise entirely server-rendered.
- **Per-credential navigation entries.** One entry for `/credentials`, never one per
  credential, matching the rule the case-study archive already follows.
- **Renewal reminders or expiry countdowns.** The warning tone communicates state; a
  computed countdown is a derived figure about the future, and nothing here needs one.