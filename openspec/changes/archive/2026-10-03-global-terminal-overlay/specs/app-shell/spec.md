## MODIFIED Requirements

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