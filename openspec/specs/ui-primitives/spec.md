## Purpose

Defines the reusable presentational component contracts for Gladwin.dev: buttons, the card family, metadata label–value rows, and status indicators. These primitives are the only sanctioned way for the later case-study, credential, and terminal features to render chrome, so they carry the accessibility guarantees and the token discipline of the design system.
## Requirements
### Requirement: Primitives are presentational and domain-agnostic

Every primitive SHALL accept only already-resolved display data as props. Primitives SHALL NOT import, parse, or fetch any content source; SHALL NOT contain domain vocabulary such as "project", "certification", "experience", or "credential"; and SHALL NOT branch on domain types. A primitive's behavior SHALL be fully determined by its variant, size, and tone props plus its children.

#### Scenario: Primitives contain no domain knowledge

- **WHEN** a primitive's source is inspected
- **THEN** it references no domain model, no content collection, and no domain-specific category or type

#### Scenario: Domain data is resolved before it reaches a primitive

- **WHEN** a caller renders a primitive with real content
- **THEN** the caller has already resolved that content into primitive props, and the primitive performs no lookup

### Requirement: Primitives render without client-side JavaScript

Every primitive SHALL render its full content in the initial server response and SHALL remain legible and navigable when client-side scripting is unavailable. A primitive SHALL NOT require hydration in order to display its content or its state.

#### Scenario: Content is present in the initial response

- **WHEN** a page is fetched without executing scripts
- **THEN** every primitive's text content and visual state are present in the returned markup

#### Scenario: Navigation and controls do not depend on scripting

- **WHEN** client-side scripting is unavailable and a user activates a control that performs a plain navigation
- **THEN** the navigation occurs by ordinary document navigation

### Requirement: Buttons expose a constrained variant set

`Button` SHALL expose exactly these variants — `primary`, `secondary`, `ghost`, and `danger` — and exactly these sizes — `sm` and `md`. The variant SHALL determine fill and border treatment; the size SHALL determine height and horizontal padding.

| Variant | Fill | Text | Notes |
| --- | --- | --- | --- |
| `primary` | `accent` | `on-accent` | One per view; the single highest-priority action |
| `secondary` | transparent | `text` | `border-strong` boundary |
| `ghost` | transparent | `text-secondary` | No boundary; for tertiary and repeated actions |
| `danger` | transparent | `destructive` | `destructive` boundary |

#### Scenario: A view has at most one primary action

- **WHEN** a view contains more than one button
- **THEN** at most one of them uses the `primary` variant, and the remainder use `secondary`, `ghost`, or `danger`

#### Scenario: Disabled buttons are conveyed by more than opacity

- **WHEN** a button is disabled
- **THEN** it is marked disabled in the accessibility tree, does not respond to activation, and is visually distinct by more than reduced opacity alone

#### Scenario: Destructive actions are visually marked as destructive

- **WHEN** a button triggers a destructive outcome
- **THEN** it uses the `danger` variant rather than the `primary` variant

### Requirement: Every interactive element has a visible focus indicator

Every interactive primitive SHALL show a visible focus indicator when keyboard-focused, at a contrast ratio of at least 3:1 against both the adjacent surface and the element's own fill, and the indicator SHALL NOT be conveyed by the element's fill color alone.

#### Scenario: Focus is visible on the page surface

- **WHEN** a button is focused with the keyboard on a `surface` background
- **THEN** a focus indicator is visible with at least 3:1 contrast against that background

#### Scenario: Focus is visible on an accent fill

- **WHEN** a `primary` button is focused
- **THEN** the focus indicator remains visible against the `accent` fill, and is not the same color as the fill

#### Scenario: Tab order reaches every interactive element

- **WHEN** a user tabs through the document
- **THEN** every button, link, and disclosure control receives focus in a visible, logical order

### Requirement: The card family has a fixed composition contract

The card family SHALL consist of `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`. `Card` SHALL render on `surface-raised` with a 1px `border` and a radius of at most 6px. `CardTitle` SHALL render in the `title` type step and SHALL be the card's accessible name when the card is a link or a labelled region. `CardDescription` SHALL support rendering as either a paragraph element (`<p>`) or a division element (`<div>`) via an `as` prop to ensure valid HTML semantics when wrapping block-level children.

#### Scenario: Card surface is the raised role

- **WHEN** a card is rendered
- **THEN** its background is `surface-raised`, it has a 1px `border` hairline, and its radius is at most 6px

#### Scenario: Card title names the card

- **WHEN** a card is exposed as a link or a labelled region
- **THEN** its accessible name is derived from its `CardTitle`

#### Scenario: Cards do not use elevation shadows

- **WHEN** a card is rendered
- **THEN** it is distinguished from the page by surface role and border only, and carries no drop shadow

#### Scenario: Card parts are optional but ordered

- **WHEN** a card omits one or more composition parts
- **THEN** the remaining parts keep their order, and no part is rendered out of sequence

#### Scenario: CardDescription renders as div when wrapping block content

- **WHEN** `CardDescription` is invoked with `as="div"`
- **THEN** it renders a `<div>` element with identical typographical classes (`wrap-anywhere text-small text-text-secondary`) and avoids nesting `<div>` descendants inside a `<p>` tag

### Requirement: Metadata renders label–value pairs in the data face

`Metadata` SHALL render a single label–value pair, and `MetadataList` SHALL render a sequence of them. The label SHALL use the `label` type step in `text-muted`; the value SHALL use the mono face in `text`. A value that is absent SHALL render an explicit muted placeholder rather than being omitted, so that row alignment is preserved.

#### Scenario: Label and value use different faces

- **WHEN** a metadata row is rendered
- **THEN** the label is uppercase mono at the `label` step and the value is mono at the `body` step, and the two are visually distinguishable

#### Scenario: Absent values keep the row

- **WHEN** a metadata pair has no value
- **THEN** an explicit muted placeholder is rendered in the value position, and the label remains visible

#### Scenario: Metadata values are selectable and copyable

- **WHEN** a metadata value such as a URL or identifier is displayed
- **THEN** it is real text, is selectable by the user, and is not rendered as an image or a non-selectable element

### Requirement: Status indicators convey state redundantly

`StatusIndicator` SHALL render a state as a shape plus a visible text label, with color applied only as reinforcement. Tone SHALL be one of `neutral`, `accent`, `success`, `warning`, `destructive`, or `info`. A status indicator SHALL NOT consist of a colored dot alone.

| Tone | Dot fill | Reserved for |
| --- | --- | --- |
| `neutral` | `text-muted` | Inactive, unknown, or not applicable |
| `accent` | `accent` | Active, live, or currently selected |
| `success` | `success` | Verified, passing, or completed |
| `warning` | `warning` | Degraded, expiring, or needing attention |
| `destructive` | `destructive` | Failed, offline, or revoked |
| `info` | `info` | Informational or scheduled |

#### Scenario: State is legible without color perception

- **WHEN** a status indicator is viewed in a greyscale rendering
- **THEN** its state is still identifiable from its shape and text label

#### Scenario: Tone never appears without a label

- **WHEN** a `StatusIndicator` is rendered
- **THEN** a text label accompanies the dot, and the label text is supplied by the caller

#### Scenario: Accent and warning indicators are told apart in greyscale

- **WHEN** an `accent` indicator and a `warning` indicator appear together
- **THEN** they are distinguishable by shape and by label text, independent of the amber-versus-yellow hue difference

#### Scenario: The dot is hidden from assistive technology

- **WHEN** a status indicator is exposed to a screen reader
- **THEN** the dot contributes no announcement, and the label text is announced exactly once

### Requirement: Primitives enforce the token layer

Primitives SHALL color, space, and round themselves exclusively through design-system token roles. Primitives SHALL NOT contain raw color literals, off-scale spacing values, or radii above 6px.

#### Scenario: No raw colors in primitive source

- **WHEN** a primitive's source is inspected
- **THEN** it contains no hex, RGB, or OKLCH color literal

#### Scenario: No off-scale metrics in primitive source

- **WHEN** a primitive's source is inspected
- **THEN** every spacing value is a declared scale step and every radius is 2px, 4px, or 6px

### Requirement: Adding a primitive requires the same guarantees

A newly added primitive SHALL meet every requirement in this capability — presentational, server-rendered, token-only, focus-visible — before it is used by any feature. A primitive SHALL NOT be introduced that requires a runtime dependency, client-side rendering, or a new color value.

#### Scenario: New primitive review gate

- **WHEN** a new primitive is added
- **THEN** it is verified against the presentational, server-render, token-only, and focus-visible requirements before any feature consumes it

#### Scenario: No dependency is added for a primitive

- **WHEN** the primitive set is complete
- **THEN** the application's runtime dependency list is unchanged from the project scaffold

