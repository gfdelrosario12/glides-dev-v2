## Purpose

Defines the single source of truth for the Gladwin.dev dark charcoal design system: the surface, text, border, and semantic accent color roles, plus the spacing, border-weight, and radius scales. Every other capability and every future feature consumes colors and metrics from this layer only, by role name, so that no component ever references a raw hue value.

## Requirements

### Requirement: Dark-only surface hierarchy

The system SHALL expose exactly four surface roles, ordered by elevation, and SHALL render the page in the dark direction unconditionally. The system SHALL NOT respond to a `prefers-color-scheme: light` preference and SHALL NOT ship a light theme.

| Role | Value | OKLCH |
| --- | --- | --- |
| `surface` | `#0B0C0E` | `oklch(0.154 0.005 264)` |
| `surface-raised` | `#131519` | `oklch(0.195 0.009 264)` |
| `surface-inset` | `#1A1D22` | `oklch(0.230 0.011 261)` |
| `surface-overlay` | `#22262C` | `oklch(0.267 0.013 258)` |

#### Scenario: Page renders dark regardless of OS preference

- **WHEN** a visitor whose operating system requests a light color scheme loads any route
- **THEN** the page background is the `surface` value `#0B0C0E` and no light-theme token set is applied

#### Scenario: No pure black or pure white is present

- **WHEN** the token set is inspected
- **THEN** no surface role resolves to `#000000` and no text role resolves to `#FFFFFF`

#### Scenario: Elevation is expressed by surface role, not by shadow

- **WHEN** an element is placed above the page surface
- **THEN** it selects a higher `surface-*` role, and drop shadows are not used as the elevation signal

### Requirement: Text color roles meet WCAG AA on every surface

The system SHALL expose exactly three text roles, and each SHALL achieve a contrast ratio of at least 4.5:1 against all four surface roles.

| Role | Value | OKLCH | Contrast on `surface` → `surface-overlay` |
| --- | --- | --- | --- |
| `text` | `#E8EAED` | `oklch(0.936 0.005 258)` | 16.24 → 12.61 |
| `text-secondary` | `#A8AEB8` | `oklch(0.749 0.016 261)` | 8.77 → 6.81 |
| `text-muted` | `#868E9A` | `oklch(0.644 0.020 258)` | 5.92 → 4.60 |

#### Scenario: Body copy is legible on a raised card

- **WHEN** `text` copy is rendered on a `surface-raised` element such as a card
- **THEN** the measured contrast ratio is at least 4.5:1

#### Scenario: Muted metadata is legible on the highest surface

- **WHEN** `text-muted` copy is rendered on a `surface-overlay` element
- **THEN** the measured contrast ratio is at least 4.5:1

#### Scenario: Text roles are used by rank, not arbitrarily

- **WHEN** three levels of text hierarchy are present in one component
- **THEN** they use `text`, `text-secondary`, and `text-muted` respectively, in that order of decreasing prominence

### Requirement: Amber is the sole accent and is reserved

The system SHALL define exactly one accent family, amber, for content that is actionable, active, focused, or live. The system SHALL NOT use the accent as a general-purpose highlight, and SHALL NOT introduce a second accent hue for non-status emphasis.

| Role | Value | OKLCH |
| --- | --- | --- |
| `accent` | `#FFB020` | `oklch(0.813 0.165 75)` |
| `accent-hover` | `#FFC24D` | `oklch(0.849 0.147 80)` |
| `accent-subtle` | `#3A2A0E` | `oklch(0.297 0.048 79)` |
| `on-accent` | `#0B0C0E` | `oklch(0.154 0.005 264)` |

#### Scenario: Accent is used only for actionable or live content

- **WHEN** the accent color is applied anywhere in the interface
- **THEN** the element is an interactive control, a focus indicator, the active navigation item, or a live/active status
- **AND** it is not used for decorative emphasis such as section headings, dividers, or background fills behind ordinary prose

#### Scenario: Text on an accent fill is legible

- **WHEN** `on-accent` text is rendered on an `accent` or `accent-hover` fill
- **THEN** the measured contrast ratio is at least 4.5:1

#### Scenario: Accent text on a subtle accent fill is legible

- **WHEN** `accent` or `text` text is rendered on an `accent-subtle` fill
- **THEN** the measured contrast ratio is at least 4.5:1

### Requirement: Non-accent status hues are distinct from the accent

The system SHALL expose four status hues in addition to the accent: `success` `#3DD68C`, `warning` `#D9B310`, `destructive` `#F0616D`, and `info` `#58A6FF`. Each SHALL achieve at least 4.5:1 against all four surface roles. Because `warning` sits at OKLCH hue 93° and `accent` at 75°, the two SHALL be treated as visually adjacent and SHALL NOT be the sole distinguishing channel for any state.

| Role | Value | OKLCH | Contrast on `surface` → `surface-overlay` |
| --- | --- | --- | --- |
| `success` | `#3DD68C` | `oklch(0.779 0.165 157)` | 10.43 → 8.10 |
| `warning` | `#D9B310` | `oklch(0.778 0.157 93)` | 9.70 → 7.53 |
| `destructive` | `#F0616D` | `oklch(0.677 0.176 18)` | 6.18 → 4.80 |
| `info` | `#58A6FF` | `oklch(0.715 0.152 253)` | 7.75 → 6.02 |

#### Scenario: Warning and active states are distinguishable without color

- **WHEN** a warning state and an active state appear in the same view
- **THEN** each is identifiable from its text label and indicator shape, independent of the amber-versus-yellow hue difference

#### Scenario: Destructive text is legible on a raised card

- **WHEN** `destructive` is used as a text color on a `surface-raised` element
- **THEN** the measured contrast ratio is at least 4.5:1

### Requirement: Borders are hairlines with a declared strength

The system SHALL expose two border roles. `border` `#262A31` (`oklch(0.284 0.014 262)`) is a decorative hairline for dividers and card edges. `border-strong` `#66696E` (`oklch(0.520 0.009 261)`) is the boundary for interactive elements and MUST achieve at least 3:1 against `surface`, `surface-raised`, and `surface-inset`. All borders SHALL render at 1 device-independent pixel.

#### Scenario: Interactive controls use the strong border

- **WHEN** a form control or other boundary that conveys interactivity is rendered
- **THEN** it uses `border-strong`, which measures at least 3:1 against the surface it sits on

#### Scenario: Decorative dividers use the hairline

- **WHEN** a separator between list rows or a card edge is rendered
- **THEN** it uses `border` at 1px, and no minimum contrast is claimed for it

#### Scenario: No border exceeds one pixel

- **WHEN** any border in the system is rendered
- **THEN** its width is 1px, and emphasis is achieved by changing the border color role rather than the width

### Requirement: Spacing follows a four-pixel base

The system SHALL expose a spacing scale on a 4px base, exposing at minimum 0, 1, 2, 3, 4, 6, 8, 12, 16, 24, and 32 units. Layout gaps and padding SHALL NOT use values outside the scale.

#### Scenario: Section rhythm uses the declared steps

- **WHEN** vertical spacing between major page sections is specified
- **THEN** it resolves to one of the declared scale steps

#### Scenario: Arbitrary spacing is rejected

- **WHEN** a one-off value that is not on the scale is introduced
- **THEN** it is snapped to the nearest declared step

### Requirement: Radii are small and capped at six pixels

The system SHALL expose exactly three radius steps — `2px`, `4px`, and `6px` — and SHALL NOT permit a radius above 6px on any surface, including cards, buttons, inputs, and overlays.

#### Scenario: Cards use the largest radius

- **WHEN** a card is rendered
- **THEN** its corner radius is at most 6px

#### Scenario: No pill or fully rounded shape is introduced

- **WHEN** any component is added
- **THEN** no element uses a border-radius of 50%, `9999px`, or any value above 6px

### Requirement: Colors are referenced by role, never by raw value

Every color used in component markup SHALL resolve through a named token role. Raw hex, RGB, or OKLCH literals SHALL NOT appear in component files or in any inline style.

#### Scenario: Component styling contains no literal colors

- **WHEN** a component file is inspected
- **THEN** it references color utilities or variables by role name and contains no raw color literal

#### Scenario: A hue change is made in one place

- **WHEN** the amber accent value is altered
- **THEN** every accent-colored element in the interface updates, with no per-component edits

### Requirement: Tokens are the only source of theme values

All color, spacing, border, and radius values SHALL be defined once in the stylesheet's token layer and exposed to the utility layer from there. The project SHALL NOT introduce a JavaScript or JSON configuration file that duplicates these values.

#### Scenario: A single definition site

- **WHEN** the token definitions are located
- **THEN** exactly one file defines the token values, and no second file restates them

#### Scenario: Utilities derive from tokens

- **WHEN** a spacing or color utility class is used in markup
- **THEN** the class resolves to a token value rather than to a hardcoded utility default
