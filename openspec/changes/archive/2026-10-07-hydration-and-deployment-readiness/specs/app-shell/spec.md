## MODIFIED Requirements

### Requirement: The header is sticky and identifies the site

The header SHALL remain visible while the page scrolls, SHALL contain the site wordmark as the first interactive element, and SHALL contain the primary navigation and hydration-safe theme switching controls. The theme toggle control SHALL synchronize state using external store subscriptions to guarantee that server-rendered HTML and client-hydrated initial markup match identically without recoverable hydration errors or cascading renders.

#### Scenario: Header persists while scrolling

- **WHEN** the page is scrolled down past the first viewport
- **THEN** the header remains visible at the top of the viewport

#### Scenario: Wordmark is the first control in the header

- **WHEN** the header is inspected
- **THEN** the wordmark link is the first focusable element inside the header banner, and it links to the site root

#### Scenario: Header boundary is a hairline

- **WHEN** the header renders
- **THEN** its bottom edge is a 1px `border` hairline, and no drop shadow is used

#### Scenario: Theme toggle renders identically during initial hydration

- **WHEN** the application is loaded in a browser
- **THEN** the initial hydration markup for the theme toggle matches the server-rendered default without throwing hydration mismatches, and updates client state after mount via `useSyncExternalStore`
