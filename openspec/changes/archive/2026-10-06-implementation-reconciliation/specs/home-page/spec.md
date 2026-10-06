## MODIFIED Requirements

### Requirement: Primary calls to action are provided
The landing page SHALL provide at least one primary call to action and SHALL obey the one-primary-per-view rule from the button contract. Each call to action SHALL name its destination, and the landing page's primary work action SHALL point to the Projects section rather than a removed Featured Work section.

#### Scenario: At most one primary action
- **WHEN** the landing page is rendered
- **THEN** exactly one call to action uses the primary button variant, and any further calls to action use lower-emphasis variants

#### Scenario: Actions point at declared destinations
- **WHEN** the primary work action is activated
- **THEN** it navigates to the Projects section on the landing page
