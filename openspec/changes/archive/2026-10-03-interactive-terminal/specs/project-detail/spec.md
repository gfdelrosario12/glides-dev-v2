## Purpose

Defines the per-project case-study page: the declared address of every project, the page each address renders, the content that page presents, and the obligations that make it a real page in the shell rather than an overlay or a decorative expansion.

## ADDED Requirements

### Requirement: Every project declares a routable slug

Every project record SHALL declare a `slug` field, which SHALL be a lowercase, hyphen-separated identifier, SHALL be unique across the project collection, and SHALL be the project's addressable segment under the project route. The slug SHALL be declared in the content file and SHALL NOT be derived from the project's title at render time.

#### Scenario: A project is addressable by its declared slug

- **WHEN** a project declares `slug` as `guardian-vision`
- **THEN** the project is addressable at the segment `/projects/guardian-vision`

#### Scenario: A missing or malformed slug fails the build

- **WHEN** a project omits its slug, or its slug is empty, uppercase, or contains a space or an underscore
- **THEN** the build fails with an error naming the file, the record, and the slug field, and no page is produced

#### Scenario: Two projects declaring the same slug fails the build

- **WHEN** two project records declare the same slug
- **THEN** the build fails and names both records, because one of them would be unreachable at its address

#### Scenario: Renaming a title does not break the address

- **WHEN** a project's title is edited and its slug is not
- **THEN** the project's address is unchanged and its page still resolves

### Requirement: A case study page is rendered for each project

The project route SHALL render one page per project, addressed by that project's declared slug, and SHALL present the project's recorded fields.

#### Scenario: A declared slug renders its project

- **WHEN** the project route is requested with a slug that a project declares
- **THEN** a page is returned presenting that project's title, category, description, tech stack, and declared destinations

#### Scenario: An unrecognised slug returns the not-found response

- **WHEN** the project route is requested with a slug no project declares
- **THEN** the site returns its not-found response, and does NOT redirect to the index, render an empty page, or render a different project

#### Scenario: Every project has a reachable page

- **WHEN** the set of declared slugs is compared with the set of project records
- **THEN** they are the same size, so no project is left without an address

### Requirement: The case study body is authored prose and its absence is stated

A project MAY declare a `detail` field holding the case-study body. When present, it SHALL be rendered as paragraphs separated by blank lines. It SHALL NOT be interpreted as Markdown or any other markup, and no markup syntax SHALL be rendered as formatting. When absent, the page SHALL omit the body and SHALL NOT substitute generated or templated prose.

#### Scenario: A declared body renders as paragraphs

- **WHEN** a project's detail contains three paragraphs separated by blank lines
- **THEN** three paragraphs render in order, and any character that would be markup syntax renders as the literal character it is

#### Scenario: A project without a body shows no body

- **WHEN** a project declares no detail
- **THEN** the page presents the project's other recorded fields and contains no body section, and no placeholder or generated paragraph stands in for the absent one

### Requirement: Figures on a case study are derived, never authored

Every count, total, or figure presented on a project page SHALL be computed from the content model at build or request time. No figure SHALL be written into a page component.

#### Scenario: A cross-reference count matches the content

- **WHEN** a project page states how many other projects share a technology with it
- **THEN** that count equals the number the content model yields for the same query, and the figure is not present in the component source

### Requirement: A case study inherits the page shell

A project page SHALL inherit the shell from the root layout without opting out, and SHALL NOT reimplement the skip link, header, main region, or footer.

#### Scenario: The shell is present exactly once

- **WHEN** a project page is rendered
- **THEN** the document contains exactly one banner, one main region, and one contentinfo, and the skip link is the first focusable element

#### Scenario: The route cannot bypass the shell

- **WHEN** the project route is rendered
- **THEN** the skip link, header, main region, and footer are present as they are on every other route

### Requirement: A case study renders on the server

A project page and its content SHALL render on the server. The full case study SHALL be present in the initial response, and the page SHALL introduce no client component.

#### Scenario: The case study is present without scripting

- **WHEN** the page is fetched without executing client scripts
- **THEN** the title, description, tech stack, and body paragraphs are all present in the returned markup

#### Scenario: No new client leaf is introduced

- **WHEN** the client directives across the application are enumerated
- **THEN** the project route and its sections introduce no client component beyond the single navigation leaf the shell already uses

### Requirement: A case study references colours, spacing, and type by role only

A project page SHALL compose its chrome from the existing primitives and SHALL reference every colour, spacing step, border, and radius by role. It SHALL introduce no new token.

#### Scenario: No new token is introduced

- **WHEN** this change is complete
- **THEN** the token layer is unchanged, and no project-page style requires a colour, type step, radius, or spacing value outside the declared scales

#### Scenario: Chrome is composed from existing primitives

- **WHEN** the page's interactive and container elements are inspected
- **THEN** they are built from the existing button, card, metadata, and status indicator primitives

### Requirement: A case study marks its external destinations

Any destination on a project page that leaves the site SHALL open in a new browsing context, SHALL carry a relationship that prevents the opened page reaching back, and SHALL be identified as leaving the site to assistive technology.

#### Scenario: External project links are marked

- **WHEN** a project page renders its live or source destination
- **THEN** the link opens in a new browsing context, carries `rel="noopener noreferrer"`, and its accessible name states that it opens in a new tab

#### Scenario: Internal destinations are not marked as external

- **WHEN** a destination resolves to a path on this site
- **THEN** it is not given new-tab treatment and is not marked as leaving the site

### Requirement: Project pages are addressed, not listed in primary navigation

The shared navigation definition SHALL NOT contain per-project entries. Project pages are reached from the terminal, from the landing page's project content, or by direct address.

#### Scenario: Navigation does not enumerate projects

- **WHEN** the shared navigation definition is inspected
- **THEN** it contains no entry whose destination is a project address, and adding a project adds no navigation item

#### Scenario: The landing page does not enumerate projects

- **WHEN** the landing page is rendered
- **THEN** it presents its declared featured selection and states the total, and does not list every project as a link