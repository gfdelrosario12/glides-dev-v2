## Purpose

Defines the Gladwin.dev landing page: the direct personal introduction, profile image area, biography, education summary, technical focus areas, statistics band, featured case studies, and primary calls to action, together with the obligations that make it accessible, responsive, server-rendered, and honest about where its numbers come from.

## Requirements

### Requirement: The hero introduces the owner directly
The landing page SHALL open with a hero that names the site owner and states their technical direction in their own terms, above the fold and without requiring interaction. The hero SHALL identify the owner by name and SHALL state a professional role.

#### Scenario: Owner and role are visible immediately

- **WHEN** the landing page is loaded
- **THEN** the owner's name and professional role are present in the first rendered region, in readable text rather than as an image

#### Scenario: The hero states a technical direction

- **WHEN** the hero is read
- **THEN** it names the owner's primary technical direction, and that direction is infrastructure-led rather than presenting software development as the sole focus

### Requirement: A profile image area is present
The landing page SHALL provide a profile image area showing a photograph of the owner, rendered at a size appropriate for its display dimensions, and SHALL provide alternative text describing the image. The image SHALL be delivered through the framework's image component rather than as an unprocessed source file.

#### Scenario: The image renders at a sane weight

- **WHEN** the profile image is delivered to a visitor
- **THEN** the transferred bytes correspond to the rendered display size rather than to the original capture resolution

#### Scenario: The image is described

- **WHEN** the image cannot be seen
- **THEN** its alternative text identifies it as a photograph of the site owner

#### Scenario: The image does not break narrow layouts

- **WHEN** the viewport is at the narrowest supported width
- **THEN** the image is constrained to its container and the document does not scroll horizontally

### Requirement: A short biography is presented
The landing page SHALL present a short biography of the owner, rendered in the prose face at the body type step, and SHALL source it from the content model rather than embedding it in the page component.

#### Scenario: The biography is data, not markup

- **WHEN** the biography text is changed in the content model
- **THEN** the rendered biography changes, with no edit to the page or any component

#### Scenario: The biography is set in the prose face

- **WHEN** the biography is rendered
- **THEN** it uses the sans prose face at the body type step, not the mono data face

### Requirement: An education summary is presented from a content source
The landing page SHALL present an education summary covering each recorded qualification, and SHALL read it from the education content source. The education summary SHALL render each qualification's title, awarding institution, period, and specialisation. It SHALL offer a destination to the background timeline, and SHALL NOT present a second, differently-arranged presentation of the full study history that the timeline already presents.

#### Scenario: Every recorded qualification appears

- **WHEN** a qualification is added to the education content source
- **THEN** it appears in the education summary, and the count of displayed qualifications reflects the content

#### Scenario: Education renders without a bespoke layout

- **WHEN** the education summary is rendered
- **THEN** it is composed from the existing card and metadata primitives rather than a parallel set of education-only components

#### Scenario: Period and location read as machine-facing data

- **WHEN** a qualification's period and location are displayed
- **THEN** they render in the mono data face, consistent with other machine-facing strings on the page

#### Scenario: The summary leads to the full history rather than restating it

- **WHEN** the education summary is rendered
- **THEN** it offers a destination to the background timeline, and the detail paragraph of a record of study is not presented here, because the timeline presents it

#### Scenario: The landing page does not enumerate every experience

- **WHEN** the landing page is rendered
- **THEN** it presents no list of experience entries, and adding an experience adds nothing to the landing page

### Requirement: Technical focus areas are declared and evidence-backed
The landing page SHALL present the owner's technical focus areas — infrastructure, cloud, cybersecurity, networking, and IT operations — and each focus area SHALL declare the content signals that support it. The supporting count for a focus area SHALL be computed from the content model.

#### Scenario: Each focus area's count is computed

- **WHEN** a focus area is rendered
- **THEN** its supporting count is the number of content records matching its declared signals, and not a number written into the focus area's declaration

#### Scenario: A focus area with no supporting content shows no count

- **WHEN** a declared focus area matches no content records
- **THEN** no count is displayed for it, rather than a zero or a placeholder implying evidence that does not exist

#### Scenario: All five focus areas are present

- **WHEN** the focus area section is rendered
- **THEN** infrastructure, cloud, cybersecurity, networking, and IT operations each appear as a declared focus area

#### Scenario: Adding evidence changes a focus area's count

- **WHEN** an experience record is added carrying a signal declared by a focus area
- **THEN** that focus area's displayed count increases, with no edit to the focus area declaration

### Requirement: A statistics band presents derived figures
The landing page SHALL present a band of headline figures, and every figure in it SHALL be obtained from the derived-statistics interface. The band SHALL include, at minimum, figures for project count, distinct technologies applied, roles held, certifications earned, and years of practice.

#### Scenario: No figure is hardcoded

- **WHEN** the landing page sources are inspected
- **THEN** every displayed figure is read from the derived-statistics interface, and none is a literal in the component

#### Scenario: Figures respond to content changes

- **WHEN** a certification is added to the content model and the site is rebuilt
- **THEN** the certification figure increases, and no other figure is affected by that addition

#### Scenario: Years of practice is computed, not stated

- **WHEN** the years-of-practice figure is displayed
- **THEN** it is computed from the earliest start recorded in the content to the present, rather than being present in content or code

#### Scenario: Each figure is labelled in the data face

- **WHEN** a figure is displayed
- **THEN** it carries a text label rendered in the mono data face, so the figure is never a bare number

### Requirement: Featured case studies are selected by content, not by rule
The landing page SHALL present featured case studies, and the selection and ordering SHALL be declared in the content model. The landing page SHALL NOT contain a rule that chooses which case studies are featured. The landing page's featured section SHALL NOT name engagement categories in its prose, and SHALL NOT claim that a case study it does not show is unavailable, withheld, or available on request; a case study's availability is decided by its declared publication status, not by whether the landing page happens to feature it.

#### Scenario: The owner controls which work is featured

- **WHEN** a project is marked as featured with an order in the content model
- **THEN** it appears on the landing page in that order

#### Scenario: Unmarked projects are not shown as featured

- **WHEN** a project carries no featured marker
- **THEN** it does not appear in the featured case study section, while remaining available to the content model for other uses

#### Scenario: Unfeatured projects are not silently dropped

- **WHEN** the landing page renders
- **THEN** the featured section states the number of projects available in total when that number exceeds the number shown, so an unmarked project is never invisible without explanation

#### Scenario: The featured section names no category in its prose

- **WHEN** the landing page's featured section prose is inspected
- **THEN** it names no engagement category and no category list, because the set of categories is content and a name written into a component is a second declaration of it

#### Scenario: The featured section makes no availability claim

- **WHEN** a published case study is not featured
- **THEN** the featured section does not describe it as available on request, withheld, or otherwise not shown, because it is published and reachable from the archive

#### Scenario: The featured selection points at the rest of the work

- **WHEN** the landing page shows fewer case studies than exist
- **THEN** it offers a destination to the archive where the remaining ones are listed, so an unfeatured case study is one step away rather than unmentioned

### Requirement: Primary calls to action are provided
The landing page SHALL provide at least one primary call to action and SHALL obey the one-primary-per-view rule from the button contract. Each call to action SHALL name its destination, and a call to action whose destination leaves the site SHALL be marked accordingly.

#### Scenario: At most one primary action

- **WHEN** the landing page is rendered
- **THEN** exactly one call to action uses the primary button variant, and any further calls to action use lower-emphasis variants

#### Scenario: External destinations are marked

- **WHEN** a call to action points to another site
- **THEN** it opens in a new browsing context, is marked as leaving the site, and is identified as such to assistive technology

#### Scenario: Actions point at declared destinations

- **WHEN** the calls to action are inspected
- **THEN** every destination comes from the shared navigation or content declaration rather than being typed into the section

### Requirement: The landing page renders on the server
The landing page and its sections SHALL render as Server Components. No section SHALL require client-side JavaScript in order to display its content, its figures, or its links.

#### Scenario: Content is present without scripting

- **WHEN** the page is fetched without executing client scripts
- **THEN** the biography, education summary, focus areas, figures, featured case studies, and calls to action are all present in the returned markup

#### Scenario: The landing page adds no client leaf

- **WHEN** the client directives across the application are enumerated
- **THEN** the landing page and its sections introduce no new client component beyond the single navigation leaf the shell already uses

### Requirement: The landing page honours the shell and token contracts
The landing page SHALL inherit the page shell from the root layout without opting out, SHALL compose its chrome from the existing primitives, and SHALL reference colours, spacing, borders, and radii by role only. It SHALL introduce no new colour, type step, or primitive.

#### Scenario: No shell bypass

- **WHEN** the landing page is rendered
- **THEN** the skip link, header, main region, and footer are present exactly as they are on any other route, with no route-specific reimplementation

#### Scenario: Chrome is composed from existing primitives

- **WHEN** the landing page's interactive and container elements are inspected
- **THEN** they are built from the existing button, card, metadata, and status indicator primitives

#### Scenario: No new token is introduced

- **WHEN** the change is complete
- **THEN** the token layer is unchanged, and no landing-page style requires a colour, type step, radius, or spacing value outside the declared scales

#### Scenario: Regions are separated by the declared rhythm

- **WHEN** the landing page's sections are laid out
- **THEN** the gap between sibling sections uses the single declared rhythm step rather than a per-section value

### Requirement: The landing page is accessible and responsive
The landing page SHALL meet the same accessibility obligations as the rest of the site, and SHALL remain usable at every supported viewport width. It SHALL not introduce colour as the sole carrier of meaning, and SHALL keep the document free of horizontal overflow.

#### Scenario: No horizontal overflow at any supported width

- **WHEN** the page is rendered at the narrowest supported viewport with its longest real value, such as a full project URL
- **THEN** the document does not scroll horizontally and no element extends past the viewport

#### Scenario: Section structure is programmatically determinable

- **WHEN** the page is inspected for its structure
- **THEN** each major region is a labelled section with a heading, and heading levels descend without skipping a level

#### Scenario: Figures are not announced as bare numbers

- **WHEN** a figure is encountered by assistive technology
- **THEN** it is announced together with its label, so a number is never presented without meaning

#### Scenario: Focus order follows reading order

- **WHEN** a user tabs through the landing page
- **THEN** focus visits interactive elements in the order they appear visually, and every one of them shows a visible focus indicator
