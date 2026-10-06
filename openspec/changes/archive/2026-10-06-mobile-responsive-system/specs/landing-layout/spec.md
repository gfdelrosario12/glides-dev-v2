## MODIFIED Requirements

### Requirement: Landing sections stack adaptively without horizontal overflow
The landing page sections (Hero, Embedded Terminal, Education, Timeline, Projects, and Calls to Action) SHALL employ responsive flex and grid layouts that progressively evolve from single-column mobile compositions to multi-column desktop arrangements. Long strings, code, and badges SHALL wrap or scroll intentionally without causing page-wide horizontal overflow.

#### Scenario: Mobile hero and terminal viewport
- **WHEN** a user visits the home page on a mobile device
- **THEN** identity and primary action are visible in the first viewport, the terminal scales appropriately, and text wraps cleanly

#### Scenario: Timeline and project cards on touch devices
- **WHEN** a user views experience entries or project cards on mobile
- **THEN** cards stack cleanly in chronological order, tap targets for links are easily touchable, and secondary actions do not overlap
