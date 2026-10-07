## MODIFIED Requirements

### Requirement: The header is sticky and identifies the site

The header SHALL remain visible while the page scrolls across all views and screen sizes (desktop, tablet, and mobile), SHALL contain the site wordmark as the first interactive element, and SHALL contain the primary navigation, mobile navigation drawer, and hydration-safe theme switching controls. The theme toggle control SHALL synchronize state using external store subscriptions to guarantee that server-rendered HTML and client-hydrated initial markup match identically without recoverable hydration errors or cascading renders. When the mobile hamburger menu is opened, the navbar SHALL remain pinned at the top of the viewport, the expanded drawer panel SHALL render directly beneath the header without clipping or horizontal overflow, and a portaled backdrop SHALL dim the underlying viewport. Anchor navigation SHALL account for the sticky navbar height so section headings are never obscured underneath it.

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

#### Scenario: Mobile drawer renders correctly beneath sticky navbar
- **WHEN** the mobile menu button is activated on a mobile viewport
- **THEN** the navbar remains fixed at the top, the navigation drawer panel renders directly beneath the navbar spanning the viewport width, and the backdrop dims the page behind the navbar

#### Scenario: Anchor navigation maintains clearance
- **WHEN** an anchor or hash target is navigated to
- **THEN** the target element is positioned with clearance below the sticky header without being hidden underneath it
