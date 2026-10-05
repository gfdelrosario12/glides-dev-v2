## Purpose

Defines the dual typeface system for Gladwin.dev: IBM Plex Sans for human-readable prose and IBM Plex Mono for every machine-facing string, together with the type scale, the font-loading contract, and the rule that decides which face a string is rendered in.

## ADDED Requirements

### Requirement: Two typefaces, each with one role

The system SHALL load exactly two typefaces and SHALL assign each a single, non-overlapping role. IBM Plex Sans renders prose. IBM Plex Mono renders machine-facing data. No third family SHALL be introduced.

| Face | Role |
| --- | --- |
| IBM Plex Sans | Prose: headings, paragraphs, navigation labels, button labels, card descriptions |
| IBM Plex Mono | Data: metadata labels and values, tech stacks, status indicators, dates, durations, versions, counts, URLs, file paths, identifiers, terminal content |

#### Scenario: Prose renders in the sans face

- **WHEN** a paragraph, heading, or navigation label is rendered
- **THEN** it uses IBM Plex Sans

#### Scenario: Machine-facing strings render in the mono face

- **WHEN** a metadata value, technology tag, date, count, version, URL, or identifier is rendered
- **THEN** it uses IBM Plex Mono

#### Scenario: A string is never ambiguous between the two roles

- **WHEN** a new text element is added
- **THEN** its face is determined by whether the string is prose or data, and a string is not rendered in the mono face merely for stylistic effect

### Requirement: Fonts are self-hosted through the framework and cause no layout shift

Both typefaces SHALL be loaded through the framework's font facility, SHALL be served from the application's own origin, and SHALL reserve their metrics so that rendering them does not shift surrounding layout. No font file SHALL be committed to the repository and no font SHALL be requested from a third-party origin at runtime.

#### Scenario: No external font request at runtime

- **WHEN** a page is loaded with network requests observed
- **THEN** no font file is requested from a third-party host

#### Scenario: No font binaries in the repository

- **WHEN** the repository tree is inspected
- **THEN** it contains no `.woff`, `.woff2`, `.ttf`, or `.otf` file

#### Scenario: Text renders in the intended face before fonts finish loading

- **WHEN** the page is first painted
- **THEN** the reserved fallback occupies the same space as the final face, so no subsequent reflow of surrounding content occurs

#### Scenario: Fallbacks are metric-compatible enough to avoid reflow

- **WHEN** the webfont is unavailable
- **THEN** the declared fallback stack renders the text legibly in the same face classification (sans or monospace) and at the same size

### Requirement: The type scale is defined in rem and paired with a line height

The system SHALL define a named type scale in `rem` units, each step declaring a size and a line height. Absolute pixel font sizes SHALL NOT be used for text.

| Step | Size | Line height | Letter spacing | Typical use |
| --- | --- | --- | --- | --- |
| `display` | 2.5rem | 1.1 | -0.02em | Page or section masthead |
| `title` | 1.5rem | 1.25 | -0.01em | Card and section titles |
| `heading` | 1.125rem | 1.35 | 0 | Sub-headings |
| `body` | 1rem | 1.65 | 0 | Paragraphs, card descriptions |
| `small` | 0.875rem | 1.5 | 0 | Secondary prose |
| `label` | 0.75rem | 1.4 | 0.06em | Uppercase mono labels, metadata keys |
| `code` | 0.8125rem | 1.6 | 0 | Inline code, terminal content |

#### Scenario: Scale steps are used as declared

- **WHEN** a text element is sized
- **THEN** it selects one of the seven declared steps and inherits that step's line height and letter spacing

#### Scenario: Prose line height supports reading

- **WHEN** body copy is rendered
- **THEN** its line height is at least 1.5, and the `label` step is the only step with positive letter spacing

### Requirement: Uppercase mono labels are the system's label treatment

Labels that name a field, a category, or a state SHALL be rendered in the mono face, at the `label` scale step, in uppercase, with letter spacing. Such labels SHALL use `text-muted` and SHALL NOT rely on weight alone for emphasis.

#### Scenario: Field labels are uniformly treated

- **WHEN** any field name, category name, or state name is displayed as a label
- **THEN** it is uppercase mono at the `label` step in `text-muted`

#### Scenario: Label treatment does not depend on font weight

- **WHEN** a label is rendered on a surface where a heavier weight would not be distinguishable
- **THEN** the label remains identifiable by its case, family, size, and spacing

### Requirement: Inline code and terminal content share a mono treatment

Inline code, code blocks, and any future terminal surface SHALL use IBM Plex Mono on `surface-inset`, and SHALL be visually distinct from surrounding prose by background rather than by color alone.

#### Scenario: Inline code is distinguishable from prose

- **WHEN** inline code appears within a paragraph
- **THEN** it is rendered in the mono face on an inset background, and is identifiable when the accent color is not perceivable

#### Scenario: Terminal surface is a layout, not a feature

- **WHEN** a terminal-shaped region is reserved for future use
- **THEN** it is expressed only as a framed, inset, mono-typed region with no interactive behavior

### Requirement: Font loading is owned by the root document

The typeface variables SHALL be declared once on the root layout and SHALL be available to every route, so that no page or component re-declares a font.

#### Scenario: Fonts apply without per-route setup

- **WHEN** a new route is added
- **THEN** both typefaces are available to it without any additional font configuration

#### Scenario: No component re-declares a font

- **WHEN** any component file is inspected
- **THEN** it contains no font-loading call and no independent font-family declaration outside the token layer
