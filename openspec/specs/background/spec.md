## Purpose

Presents the owner's education and twenty recorded experiences as operational history: two
timelines grouped by the kind of work, each entry showing what was operated and with what,
rather than a list of titles and employers.

## Requirements

### Requirement: The background route presents both timelines
The system SHALL provide a `/background` route presenting an education timeline and an
experience timeline, and SHALL add exactly one entry for that route to the shared
navigation definition. Individual experience entries SHALL NOT appear in the navigation, so
the number of navigation items does not depend on how many are recorded.

#### Scenario: Every recorded entry appears

- **WHEN** the `/background` route is rendered
- **THEN** every record in the education content source appears on the education timeline and every record in the experience content source appears on the experience timeline

#### Scenario: Navigation names the route once

- **WHEN** the shared navigation definition is inspected
- **THEN** it contains one entry whose destination is the background route, and no entry whose destination is a single record's address

#### Scenario: Adding a record adds no navigation item

- **WHEN** a twenty-first experience is recorded
- **THEN** it appears on the timeline and the navigation item count is unchanged

#### Scenario: An empty content source yields an empty timeline, not an error

- **WHEN** a timeline's content source records nothing
- **THEN** the route renders, states that nothing is recorded for that timeline, and presents no entry

### Requirement: Entries are ordered by recency with a total order
Each timeline SHALL order its entries by the end of the stated period, most recent first, and an entry whose period is still open SHALL be treated as more recent than every entry that has ended. Ties SHALL be broken so that the order does not depend on the order rows appear in the content file.

#### Scenario: Most recent comes first

- **WHEN** a timeline holds entries whose periods end in different years
- **THEN** the entry whose period ended last is presented first

#### Scenario: An open period outranks a finished one

- **WHEN** one entry's period is still open and another's ended
- **THEN** the entry with the open period is presented first

#### Scenario: Entries sharing a period keep a stable order

- **WHEN** two entries end in the same period
- **THEN** their relative order is decided by a stated secondary comparison rather than by their order in the content file, and it is the same on every build

#### Scenario: Reordering the content file does not reorder the timeline

- **WHEN** the rows of a timeline's content source are rearranged without changing any value
- **THEN** the timeline presents the same entries in the same order

### Requirement: Entries are grouped by the kind of work they represent
Each experience SHALL declare which kind of work it represents, from a declared set, and
the experience timeline SHALL group entries by that declaration. An entry declaring none
SHALL still be presented, in a group that does not claim a kind for it. The experience timeline SHALL present all five declared kinds. Its introduction SHALL state the unclassified remainder rather than implying the grouping is complete.

#### Scenario: Entries sharing a kind are grouped together

- **WHEN** two experiences declare the same kind of work
- **THEN** they appear in the same group on the timeline

#### Scenario: An unclassified entry is still presented

- **WHEN** an experience declares no kind of work
- **THEN** it appears on the timeline in a group that states no kind, rather than being omitted or assigned one

#### Scenario: An undeclared kind fails the build

- **WHEN** an experience declares a kind that is not one of the declared values
- **THEN** the build fails naming the file, the record, and the offending value, and names the permitted kinds

#### Scenario: Groups appear in a declared order, not an alphabetical accident

- **WHEN** the timeline is rendered
- **THEN** its groups appear in one stated order, and that order does not change when a kind's name would sort differently


#### Scenario: The unclassified count is stated in the introduction

- **WHEN** the timeline renders groups for the declared kinds
- **THEN** the page's introduction reads the derived account to state the unclassified count, explicitly presenting the unclassified remainder rather than implying the grouping is complete

### Requirement: An entry presents the operational record, not only the role
An experience entry SHALL present its organization, role, period, role shape, the work as
recorded, and the responsibilities, tools, and systems it declares. A declared field SHALL
be presented where the record supplies one. An absent optional field SHALL be omitted
rather than rendered as a placeholder.

#### Scenario: The declared detail is presented

- **WHEN** an experience declares responsibilities, tools, or systems
- **THEN** the entry presents each declared one

#### Scenario: Absent detail is omitted, not announced as missing

- **WHEN** an experience declares no responsibilities, tools, or systems
- **THEN** the entry presents no region for them and no placeholder standing in for the absent one

#### Scenario: The recorded account of the work is presented

- **WHEN** an experience entry is rendered
- **THEN** it presents the record's own description of the work, transcribed as written and not summarised or reworded

#### Scenario: A lesson learned is presented when declared

- **WHEN** an experience declares a lesson learned
- **THEN** the entry presents it under its own heading

#### Scenario: No lesson learned means no heading

- **WHEN** an experience declares no lesson learned
- **THEN** the entry presents no heading for one

### Requirement: An entry presents the case studies it evidences
An experience entry SHALL present the case studies that name it, derived from those records
rather than maintained on the experience. An experience no case study names SHALL render no
related-work region.

#### Scenario: Related case studies resolve to the records

- **WHEN** an experience names one or more case studies
- **THEN** the entry presents those case studies by title, and each links to its own page

#### Scenario: The relationship is stated once

- **WHEN** the relationship between an experience and a case study is inspected
- **THEN** it is declared on one side, and the experience's side is derived rather than maintained by hand

#### Scenario: An unevidenced experience renders no region

- **WHEN** no case study names an experience
- **THEN** its entry presents no related-work region and no placeholder heading

### Requirement: The education timeline presents study as a record
Each education entry SHALL present its credential, awarding institution, period, location,
and fields of study, and SHALL present the detail paragraph as recorded. A record stating no
credential level SHALL present no credential level rather than an invented one.

#### Scenario: Each study record presents its declared facts

- **WHEN** an education timeline entry is rendered
- **THEN** it presents the credential where one is declared, the awarding institution, the period, the location, and the fields of study

#### Scenario: A record with no credential level states none

- **WHEN** a record of study declares no credential level
- **THEN** its entry presents no credential level and no placeholder stands in for the absent one

#### Scenario: The recorded detail is presented as written

- **WHEN** an education timeline entry is rendered
- **THEN** it presents the record's detail paragraph as written, without summarising it

### Requirement: The background route is server-rendered and reachable without a pointer
The `/background` route SHALL be rendered on the server and SHALL introduce no client
component, and its destination SHALL be reachable from the site's navigation and from the
education content the landing page presents, so that a visitor is never left without a route
to it.

#### Scenario: The whole page is present without scripting

- **WHEN** the background route is requested with scripting unavailable
- **THEN** both timelines and every entry are present in the response, and nothing is fetched afterwards

#### Scenario: No credential field is shipped to the browser

- **WHEN** the background route is rendered
- **THEN** no record from either content source appears in a client bundle

#### Scenario: The route is reachable from more than one place

- **WHEN** the site's navigation and the landing page's education region are inspected
- **THEN** both offer a destination to the background route

### Requirement: Entries are addressable without a route each
Each experience entry SHALL have an addressable segment declared on the record and exposed
as an in-page anchor, so an entry can be linked to directly without a route being generated
for it.

#### Scenario: An entry can be linked to

- **WHEN** an experience declares an addressable segment
- **THEN** the timeline entry for it carries that segment as an anchor identifier

#### Scenario: Two entries cannot share one segment

- **WHEN** two experiences declare the same addressable segment
- **THEN** the build fails naming both records, because one identifier would be ambiguous

#### Scenario: The segment is not derived from the role title

- **WHEN** an experience's role title is corrected
- **THEN** its segment is unchanged, and links to it keep working
