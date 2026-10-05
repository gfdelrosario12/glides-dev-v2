## Why

The nine narrative sections a case study may declare exist in the content model but are empty for all seven published case studies, so every case-study page currently renders as a title, a description, a chip row, and two buttons — no architecture, no infrastructure, no security, no results. The content model also has nowhere to put a code snippet, nowhere to say which section an image belongs to, and no concept of a diagram, so the richest material a case study could carry has no representation at all.

## What Changes

- **Establish a ten-section structure** as a declared contract rather than a set of optional columns: Overview, Problem, Architecture, Implementation, Infrastructure, Security, Challenges, Results, Lessons Learned, and Technologies. The first nine already exist as narrative sections; **Technologies becomes the tenth**, and its body is the case study's resolved technology records rather than authored prose.
- **Gate publication on completeness (BREAKING).** A case study SHALL NOT be `published` unless it declares all ten. A draft may declare any subset, so sections can be written incrementally. This turns the current state — seven published case studies with no sections at all — into a build failure, which is the intended behaviour of a gate and is called out in the migration plan below.
- **Make media section-scoped and typed.** `case-study-media.csv` gains a required `section` (which of the ten it belongs to), a required `kind` (`diagram` or `photo`), and an optional `caption`. Media is rendered inside the section that declares it rather than in one flat region at the foot of the page.
- **Give the Architecture section visual priority.** A diagram declared for Architecture is rendered ahead of that section's prose, at a wider slot than a photograph, so the structure of the system is the first thing read rather than something described in a paragraph.
- **Add a code-snippet collection.** New `content/case-study-snippets.csv`, keyed to a case study and a section, carrying a language, an optional caption, a display order, and the code itself. Snippets render inside the section that declares them.
- **State that code is not prose.** Snippet text preserves its whitespace and line breaks and is never interpreted as markup, matching the existing rule for narrative sections. No syntax highlighting and no copy-to-clipboard button, both of which would need a client boundary the content pages do not have.
- **Reorganise the case-study page around one reusable layout.** The route's ten inline components become a layout driven by the section list, so every section gets the same treatment and a new section is a data edit rather than a new component.
- Keep the existing guarantees intact: the route still generates dynamically from slugs, still serves only published case studies, still renders entirely on the server, and still ships no content to the browser.

## Capabilities

### New Capabilities

None. This change alters the behaviour of the case-study page, which `project-detail` already owns, and of the records behind it, which `content-model` already owns. Splitting one page's behaviour across a third capability would let the two disagree.

### Modified Capabilities

- `project-detail`: a case study page presents all ten sections in the declared order; publication requires completeness; a section renders its own media and snippets with diagrams ahead of prose; the page is composed by one reusable layout.
- `content-model`: the ten-section structure is declared once and referenced by both media and snippets; a case study's completeness is validated against it; snippet records are a new collection validated like every other; media carries a section, a kind, and a caption; snippet text is data rather than prose.

## Impact

- **Content model**: `lib/content/schema.ts` gains the section-key declaration, `MEDIA_KINDS`, and a `CASE_STUDY_SNIPPET_SCHEMA`; `lib/content/model.ts` resolves section-scoped media and snippets and exposes a completeness signal per case study.
- **New content file**: `content/case-study-snippets.csv`, created with a header row and no records. `content/case-study-media.csv` gains three columns; it currently has zero rows, so nothing is rewritten.
- **Route and components**: `app/projects/[slug]/page.tsx` is reorganised around a layout component; the ten inline components become section-level pieces.
- **Content data**: every published case study needs nine prose sections written and at least one technology recorded before the build passes. The owner writes them; this change does not author prose about the work.
- **No new dependency.** No syntax highlighter, no diagram library, no client component. The diagram is an image the owner supplies.
- **Compatibility**: the seven published addresses are unchanged. What changes is that they cannot stay published until documented.

## Non-goals

- **Syntax highlighting.** It needs a highlighter dependency and a client or build-time transform. Snippets render as plain preserved text in the mono face.
- **A copy-to-clipboard button.** It needs client state and `navigator.clipboard`, which the content pages deliberately do not have.
- **Structured diagram data.** Nodes and edges authored as records and rendered as SVG would be genuinely data-driven, but it means authoring a diagram model for every case study, and the architecture being described belongs to the owner. This change takes the diagram as an image with a declared kind.
- **Authoring the section prose.** The content model forbids the system writing prose about the owner's work. The gate makes the absence loud; it does not fill it.
- **Per-case-study section ordering or custom section names.** The ten are fixed and ordered. A case study that needs a different shape needs a different change.
- **Interactive architecture diagrams.** No hover states, no zoom, no expand. A diagram is a figure with an alternative description and a caption.
- **Images sized or converted at build time.** The record declares a source and an alternative description; the layout reserves no intrinsic dimensions it was not told.
- **A completeness indicator on the page.** The gate is a build-time rule, not a badge. A published case study is complete by construction, so there is nothing to indicate.