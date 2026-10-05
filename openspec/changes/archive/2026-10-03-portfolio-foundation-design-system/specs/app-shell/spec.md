## Purpose

Defines the global navigation and the shared page shell for Gladwin.dev — skip link, sticky header, width-constrained main column, and footer — together with the responsive layout foundation and vertical rhythm that every route and every future feature composes against.

## ADDED Requirements

### Requirement: Every route inherits the same shell

The shell SHALL be applied once at the root layout, so that no route can render without it. A route SHALL NOT be able to opt out of the header, footer, or main column by omission.

#### Scenario: A new route inherits the shell automatically

- **WHEN** a new page is added under the application router
- **THEN** it renders inside the skip link, header, constrained main column, and footer without any additional wiring

#### Scenario: The shell cannot be bypassed

- **WHEN** any route is requested
- **THEN** the response contains the same header and footer landmarks, and exactly one main region

### Requirement: The page exposes correct landmark structure

Each rendered page SHALL expose a banner landmark for the header, a main landmark for the primary content, and a contentinfo landmark for the footer. The main landmark SHALL be the unique `main` region of the page, and the document SHALL declare its language.

#### Scenario: Landmarks are present and unique

- **WHEN** a page is inspected for its landmark structure
- **THEN** exactly one `banner`, one `main`, and one `contentinfo` region are present

#### Scenario: Document language is declared

- **WHEN** a page is served
- **THEN** the root element declares the document language

### Requirement: A skip link is the first focusable element

The page SHALL render a visually hidden-until-focused skip link as the first focusable element in the document. Activating it SHALL move focus to the start of the main content region, and the link SHALL become visible when focused.

#### Scenario: Skip link precedes all other controls

- **WHEN** a user presses Tab from the top of the document
- **THEN** the skip link receives focus before the header navigation or any other control

#### Scenario: Skip link is visible when focused

- **WHEN** the skip link has keyboard focus
- **THEN** it is visible on screen with a contrast ratio of at least 4.5:1, and is not clipped or transparent

#### Scenario: Activating the skip link moves focus into main

- **WHEN** a user activates the focused skip link
- **THEN** focus moves to the main content region so the next Tab continues from the top of the content

### Requirement: The header is sticky and identifies the site

The header SHALL remain visible while the page scrolls, SHALL contain the site wordmark as the first interactive element, and SHALL contain the primary navigation. The header SHALL be separated from scrolling content by a bottom hairline border.

#### Scenario: Header persists while scrolling

- **WHEN** the page is scrolled down past the first viewport
- **THEN** the header remains visible at the top of the viewport

#### Scenario: Wordmark is the first control in the header

- **WHEN** the header is inspected
- **THEN** the wordmark link is the first focusable element inside the header banner, and it links to the site root

#### Scenario: Header boundary is a hairline

- **WHEN** the header renders
- **THEN** its bottom edge is a 1px `border` hairline, and no drop shadow is used

### Requirement: Navigation items come from one declared source

The primary navigation items and the social links SHALL be declared once in a single shared definition, and both the desktop and mobile navigation SHALL render from that same definition. A route SHALL NOT hardcode a navigation item.

#### Scenario: Desktop and mobile navigation agree

- **WHEN** the desktop navigation and the mobile navigation are compared
- **THEN** they present the same set of links, in the same order, with the same labels

#### Scenario: Adding a route updates navigation in one place

- **WHEN** an item is added to the shared navigation definition
- **THEN** it appears in both the desktop and the mobile navigation without further edits

#### Scenario: External links are marked

- **WHEN** a navigation or footer link points to an external origin
- **THEN** it opens in a new browsing context with `rel="noopener noreferrer"`, and is identified as leaving the site

### Requirement: The active route is indicated

The navigation SHALL indicate which route is current. The current item SHALL be conveyed by at least two channels, one of which is not color, and SHALL be exposed to assistive technology as the current page.

#### Scenario: Current route is marked accessibly

- **WHEN** the visitor is on a route that appears in the navigation
- **THEN** that item is exposed as the current page to assistive technology, and carries a non-color marker in addition to the `accent` color

#### Scenario: Current-route styling does not depend on color alone

- **WHEN** the navigation is rendered in greyscale
- **THEN** the current item is still identifiable

#### Scenario: Non-current items are not marked

- **WHEN** the visitor is on one route
- **THEN** no other navigation item carries the current-page marker

### Requirement: Navigation collapses to a disclosure control at small widths

Below the small breakpoint, the primary navigation SHALL collapse behind a single disclosure control. The disclosure SHALL report its expanded and collapsed state to assistive technology, and SHALL be operable by keyboard.

#### Scenario: Links are reachable at small widths

- **WHEN** the viewport is narrower than the small breakpoint
- **THEN** the primary navigation links are not displayed inline, and a single control exposes them on demand

#### Scenario: Disclosure reports its state

- **WHEN** the disclosure is expanded
- **THEN** it exposes an expanded state to assistive technology and marks the controlled navigation region as expanded

#### Scenario: Disclosure is keyboard operable

- **WHEN** the disclosure is reached by keyboard and activated with Enter or Space
- **THEN** the navigation region opens or closes and focus remains on the control

#### Scenario: Nav labels remain legible when collapsed

- **WHEN** the viewport is at the smallest supported width
- **THEN** the wordmark and the disclosure control remain visible and do not overlap or truncate

### Requirement: The main column is width-constrained and responsive

The main content region SHALL be constrained to a maximum reading width on wide viewports and SHALL fill the viewport minus gutters on narrow ones. The main column SHALL NOT introduce horizontal scrolling at any supported width.

#### Scenario: Content is centered on wide viewports

- **WHEN** the viewport is wider than the maximum content width
- **THEN** the main column is centered and its content width does not increase

#### Scenario: No horizontal overflow

- **WHEN** the viewport is at the smallest supported width and content includes a long unbroken string such as a URL
- **THEN** the document does not scroll horizontally

#### Scenario: Gutters are consistent

- **WHEN** the main column is rendered at any width
- **THEN** it is inset from the viewport edge by a spacing-scale gutter, and the same gutter is used by the header and footer

### Requirement: Vertical rhythm is defined once

The spacing between major page regions SHALL be expressed with declared spacing-scale steps, and a single rhythm value SHALL be reused for the gaps between sibling regions. Regions SHALL NOT be spaced with one-off values.

#### Scenario: Sibling regions share one rhythm step

- **WHEN** two sibling page regions are separated
- **THEN** the gap is the declared section rhythm step, and is not a one-off value

#### Scenario: Rhythm step is reusable by features

- **WHEN** a future feature adds a new section to the main column
- **THEN** it adopts the existing rhythm step rather than defining its own

### Requirement: The footer states authorship and a build stamp

The footer SHALL contain a colophon that identifies the site owner, and SHALL contain a build or technology stamp rendered in the mono face as machine-facing data. The footer SHALL NOT introduce a second accent usage beyond a single link treatment.

#### Scenario: Colophon identifies the owner

- **WHEN** the footer is rendered
- **THEN** it names the site owner

#### Scenario: Build stamp is treated as data

- **WHEN** the build stamp is rendered
- **THEN** it uses the mono face and the `text-muted` color, consistent with other machine-facing strings

### Requirement: The shell is presentational

The shell components SHALL accept their navigation and footer content from the shared navigation definition and SHALL NOT contain domain vocabulary, fetch content, or branch on domain types. The shell SHALL render its full structure in the initial server response, and SHALL NOT require client-side scripting to display it.

#### Scenario: Shell content is data-driven

- **WHEN** the shared navigation definition is edited
- **THEN** the header, mobile navigation, and footer all reflect the change with no component edits

#### Scenario: Shell renders without scripting

- **WHEN** a page is fetched without executing scripts
- **THEN** the skip link, header, main region, and footer markup are all present in the response
