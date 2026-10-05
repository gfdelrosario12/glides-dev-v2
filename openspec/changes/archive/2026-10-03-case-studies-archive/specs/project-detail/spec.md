## MODIFIED Requirements

### Requirement: A case study page is rendered for each published case study

The project route SHALL render one page per published case study, addressed by that case study's declared slug, and SHALL present the case study's recorded fields. A case study page SHALL present the technical domains the case study declares, and SHALL offer a destination back to the archive that lists every published case study.

#### Scenario: A declared slug renders its case study

- **WHEN** the project route is requested with a slug a published case study declares
- **THEN** a page is returned presenting that case study's recorded title, category, domains, year, role, technologies, external destinations, and narrative sections

#### Scenario: An unrecognised slug returns the not-found response

- **WHEN** the project route is requested with a slug no case study declares
- **THEN** the site returns its not-found response, and does NOT redirect to the index, render an empty page, or render a different case study

#### Scenario: An unpublished slug returns the not-found response

- **WHEN** the project route is requested with a slug an unpublished case study declares
- **THEN** the site returns the same not-found response it returns for an unrecognised slug, so an unpublished case study is not discoverable by guessing its address

#### Scenario: Every published case study has a reachable page

- **WHEN** the set of slugs of published case studies is compared with the set of published case-study records
- **THEN** they are the same size, so no published case study is left without an address

#### Scenario: Absent domains are omitted rather than filled

- **WHEN** a case study declares no domain
- **THEN** its page presents no domain region and no placeholder domain stands in for the absent one

#### Scenario: A case study page offers the way back to the archive

- **WHEN** a case-study page is rendered
- **THEN** it offers a destination to the archive that lists every published case study, so a visitor who followed an address can reach the rest of the work without returning to the landing page first

### Requirement: Project pages are addressed, not listed in primary navigation

The shared navigation definition SHALL NOT contain per-project entries. Project pages are reached from the terminal, from the landing page's project content, from the archive, or by direct address. A single entry pointing at the archive as a whole SHALL NOT be a per-project entry, and its presence SHALL NOT make the number of navigation items depend on the number of case studies.

#### Scenario: Navigation does not enumerate projects

- **WHEN** the shared navigation definition is inspected
- **THEN** it contains no entry whose destination is a project address, and adding a project adds no navigation item

#### Scenario: The landing page does not enumerate projects

- **WHEN** the landing page is rendered
- **THEN** it presents its declared featured selection and states the total, and does not list every project as a link

#### Scenario: The archive is one destination, not one per case study

- **WHEN** a visitor reaches the archive and the archive is linked from a case-study page
- **THEN** a single destination to the archive is offered, and the navigation item count is the same whether the archive holds two case studies or two hundred
