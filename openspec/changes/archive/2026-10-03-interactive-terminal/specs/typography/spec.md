## RENAMED Requirements

- FROM: `Inline code and terminal content share a mono treatment`
- TO: `Inline code and terminal surfaces use declared mono treatments`

## MODIFIED Requirements

### Requirement: The type scale is defined in rem and paired with a line height

The system SHALL define a named type scale in `rem` units, each step declaring a size and a line height. Absolute pixel font sizes SHALL NOT be used for text.

| Step | Size | Line height | Letter spacing | Typical use |
| --- | --- | --- | --- | --- |
| `display` | 2.5rem | 1.1 | -0.02em | Page or section masthead |
| `title` | 1.5rem | 1.25 | -0.01em | Card and section titles |
| `heading` | 1.125rem | 1.35 | 0 | Sub-headings |
| `body` | 1rem | 1.65 | 0 | Paragraphs, card descriptions |
| `small` | 0.875rem | 1.5 | 0 | Secondary prose, terminal content |
| `label` | 0.75rem | 1.4 | 0.06em | Uppercase mono labels, metadata keys |
| `code` | 0.8125rem | 1.6 | 0 | Inline code, code blocks |

The `code` step is sized for text embedded within a line of prose and SHALL NOT be used for a surface that is read continuously. Terminal content SHALL render at the `small` step of 0.875rem, which is the smallest step that meets the 0.85rem size-contrast floor, and SHALL NOT render below it. Terminal content's separation from the surrounding page SHALL be carried by its mono face, its surface, and its border rather than by being set smaller than the page's own secondary text.

#### Scenario: Scale steps are used as declared

- **WHEN** a text element is sized
- **THEN** it selects one of the seven declared steps and inherits that step's line height and letter spacing

#### Scenario: Prose line height supports reading

- **WHEN** body copy is rendered
- **THEN** its line height is at least 1.5, and the `label` step is the only step with positive letter spacing

#### Scenario: Terminal content meets the size-contrast floor

- **WHEN** a terminal prompt, an entered command, or terminal output is rendered
- **THEN** it renders at the `small` step of 0.875rem or larger, and not at the `code` step, whose 0.8125rem is below the 0.85rem floor

#### Scenario: The scale is not extended for a new surface

- **WHEN** terminal content is styled
- **THEN** it selects an existing scale step, and no step is added to the scale for it

### Requirement: Inline code and terminal surfaces use declared mono treatments

Inline code and code blocks SHALL use IBM Plex Mono on `surface-inset` at the `code` step, and SHALL be visually distinct from surrounding prose by background rather than by color alone.

A terminal surface SHALL use IBM Plex Mono on `surface-inset` at the `small` step, enclosed by a border, and SHALL NOT rely on the page's accent colour for its own legibility. A terminal surface SHALL be a page in the shell whose interaction behavior is defined by the terminal capability's own specification; this requirement constrains only its typography and its surface, and imposes no limit on what a terminal surface may do.

#### Scenario: Inline code is distinguishable from prose

- **WHEN** inline code appears within a paragraph
- **THEN** it is rendered in the mono face at the `code` step on an inset background, and is identifiable when the accent color is not perceivable

#### Scenario: Terminal surface meets the size-contrast floor

- **WHEN** a terminal surface renders output
- **THEN** every one of its own text elements renders at the `small` step of 0.875rem or larger, including its prompt, its entered commands, and its smallest annotation

#### Scenario: Terminal surface is identifiable without color

- **WHEN** a terminal surface is rendered
- **THEN** it is identifiable as a terminal by its mono face, its inset surface, and its enclosing border, each of which is present with no accent colour applied

#### Scenario: Terminal line breaks follow the region's own measure

- **WHEN** terminal output wraps
- **THEN** it wraps at the width of the terminal region rather than at a hard-coded column, and no line of output is clipped to preserve a fixed column