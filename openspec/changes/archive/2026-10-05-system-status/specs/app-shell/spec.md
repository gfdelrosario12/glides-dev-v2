## MODIFIED Requirements

### Requirement: The shell provides a consistent frame
The application shell SHALL provide a consistent global frame consisting of a skip link, header, main content region, and footer. The header SHALL include the global system status indicator. These elements SHALL be present on every route, and SHALL provide the site's primary navigation. The shell SHALL NOT impose a layout on the main content region beyond defining its boundaries.

#### Scenario: The shell structure is present on all routes
- **WHEN** a visitor navigates between any two pages
- **THEN** the skip link, header, status indicator, and footer remain present and consistent

#### Scenario: Navigation is available globally
- **WHEN** the shell renders
- **THEN** it presents the site's primary navigation in the header or footer

#### Scenario: The shell does not constrain main layout
- **WHEN** a route renders its content
- **THEN** it occupies the main region without being forced into a grid or column layout by the shell itself
