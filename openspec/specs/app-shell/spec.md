## Purpose

Defines the global navigation and the shared page shell for Gladwin.dev — skip link, sticky header, width-constrained main column, and footer — together with the responsive layout foundation and vertical rhythm that every route and every future feature composes against.
## Requirements
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

While a covering overlay is open, the shell beneath it SHALL be made inert, which suspends the exposure of the banner, main, and contentinfo landmarks for as long as that overlay is open. The landmarks SHALL be restored when the overlay closes. A covering overlay SHALL NOT introduce a second `main`, `banner`, or `contentinfo` region.

#### Scenario: Landmarks are present and unique

- **WHEN** a page is inspected for its landmark structure
- **THEN** exactly one `banner`, one `main`, and one `contentinfo` region are present

#### Scenario: Document language is declared

- **WHEN** a page is served
- **THEN** the root element declares the document language

#### Scenario: A closed overlay leaves landmarks exposed

- **WHEN** a page is inspected while no overlay is open
- **THEN** its `banner`, `main`, and `contentinfo` regions are exposed to assistive technology

#### Scenario: A covering overlay suspends the landmarks beneath it

- **WHEN** a covering overlay is open
- **THEN** the shell's `banner`, `main`, and `contentinfo` regions are not exposed, and no second region of any of those three kinds is introduced

#### Scenario: Closing restores the landmarks

- **WHEN** a covering overlay is closed
- **THEN** the shell's `banner`, `main`, and `contentinfo` regions are exposed again

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

### Requirement: Navigation items come from one declared source

The primary navigation items and the social links SHALL be declared once in a single shared definition, and both the desktop and mobile navigation SHALL render from that same definition. A route SHALL NOT hardcode a navigation item.

The shared definition SHALL express an item as either a destination to follow or an action to perform. An action item SHALL carry no destination, SHALL be rendered as a control rather than as a link, and SHALL be rendered in both the desktop and the mobile navigation.

#### Scenario: Desktop and mobile navigation agree

- **WHEN** the desktop navigation and the mobile navigation are compared
- **THEN** they present the same set of items, in the same order, with the same labels

#### Scenario: Adding a route updates navigation in one place

- **WHEN** an item is added to the shared navigation definition
- **THEN** it appears in both the desktop and the mobile navigation without further edits

#### Scenario: External links are marked

- **WHEN** a navigation or footer link points to an external origin
- **THEN** it opens in a new browsing context with `rel="noopener noreferrer"`, and is identified as leaving the site

#### Scenario: An action item appears in both navigations

- **WHEN** an action item is present in the shared navigation definition
- **THEN** both the desktop and the mobile navigation render it as a control that performs the action, and neither renders it as a link

#### Scenario: An action item carries no destination

- **WHEN** an action item is declared
- **THEN** it declares no destination, and inspecting it shows no address to navigate to

#### Scenario: Adding an action needs no component edit

- **WHEN** an action item is added to the shared navigation definition
- **THEN** both navigations render it as a control without any change to the header or the mobile navigation component

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

The shell SHALL provide a single mount point for a site-wide overlay, owned by the shell rather than by any route, so that a control in the header and the same control on another route are the same control.

#### Scenario: Shell content is data-driven

- **WHEN** the shared navigation definition is edited
- **THEN** the header, mobile navigation, and footer all reflect the change with no component edits

#### Scenario: Shell renders without scripting

- **WHEN** a page is fetched without executing scripts
- **THEN** the skip link, header, main region, and footer markup are all present in the response

#### Scenario: One mount point is shared by every route

- **WHEN** the overlay is opened from two different routes in turn
- **THEN** it is the same control instance and the same overlay, not a per-route copy

#### Scenario: No route owns the overlay

- **WHEN** the routes are inspected
- **THEN** no route renders its own overlay or its own terminal control, and the overlay's mount point exists once in the shell

### Requirement: Layout adopts mobile-first responsive architecture and safe-area boundaries
The page shell and header SHALL adapt gracefully across viewport widths from 320px to large screens. Safe-area padding (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) SHALL be respected so navigation and touch targets are not obscured by device notches or gestures.

#### Scenario: Viewing site on mobile screen
- **WHEN** a user navigates the site on a mobile device (320px-480px width)
- **THEN** the layout fills the viewport cleanly without horizontal overflow or clipped navigation controls

### Requirement: Mobile navigation provides accessible, touch-friendly system controls
The site header SHALL provide an intentional mobile navigation system when the viewport width is below tablet breakpoint. Navigation links SHALL have a minimum tap area of 44px by 44px, clear active states, legible numbered system indicators, and accessible keyboard dismissal.

#### Scenario: Interacting with mobile menu
- **WHEN** a user triggers the mobile navigation control
- **THEN** a structured system menu opens with touch-friendly endpoints, and dismissing it restores focus properly

