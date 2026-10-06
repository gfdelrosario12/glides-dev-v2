## MODIFIED Requirements

### Requirement: Dark-only surface hierarchy
The system SHALL expose exactly four surface roles, ordered by elevation, and SHALL render the page in dark mode by default. The user SHALL also be able to switch the interface to a light mode that preserves the same semantic roles. The system SHALL NOT rely on the operating system preference alone to choose the theme.

#### Scenario: Page renders dark by default
- **WHEN** a visitor loads the site without a saved preference
- **THEN** the interface renders in dark mode using the semantic token roles

#### Scenario: Theme can be switched
- **WHEN** a visitor activates the theme control
- **THEN** every page surface, text role, border, and native color-scheme control changes to the selected light or dark mode

#### Scenario: Theme preference persists
- **WHEN** a visitor selects a theme and opens another route or reloads the page
- **THEN** the selected theme remains active

#### Scenario: No pure black or pure white is present
- **WHEN** the token set is inspected
- **THEN** no surface role resolves to pure black and no text role resolves to pure white

#### Scenario: Elevation is expressed by surface role, not by shadow
- **WHEN** an element is placed above the page surface
- **THEN** it selects a higher surface role, and drop shadows are not used as the elevation signal

### Requirement: Tokens are the only source of theme values
All color, spacing, border, and radius values SHALL be defined once in the stylesheet's token layer and exposed to the utility layer from there. The project SHALL NOT introduce a JavaScript or JSON configuration file that duplicates these values.

#### Scenario: A single definition site
- **WHEN** the token definitions are located
- **THEN** exactly one file defines the token values, and no second file restates them

#### Scenario: Utilities derive from tokens
- **WHEN** a spacing or color utility class is used in markup
- **THEN** the class resolves to a token value rather than to a hardcoded utility default
