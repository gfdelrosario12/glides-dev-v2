## Purpose

The archive lists every published case study, with the facets, ordering, and counts derived from the records in use rather than written by hand.

## Requirements

### Requirement: The archive lists every published case study
The archive SHALL be served at a stable address and SHALL list every case study the content declares published. A case study the content does not declare published SHALL NOT appear in the archive, in any count, or in any filter option. The archive SHALL NOT list a case study that is not published as a disabled or hidden entry, because an entry that cannot be opened is one the visitor cannot act on.

#### Scenario: Every published case study appears in the archive

- **WHEN** the archive is rendered
- **THEN** it presents a card for each case study the content declares published, and the number of cards equals the number of published case studies

#### Scenario: An unpublished case study is absent entirely

- **WHEN** a case study is unpublished
- **THEN** it has no card, contributes to no filter count, and is named in no filter option

#### Scenario: Every card links to its case study's address

- **WHEN** a card is presented
- **THEN** it links to the address at which that case study's own page is served, and not directly to the live destination

#### Scenario: An archive that has nothing to list says so

- **WHEN** no case study is published
- **THEN** the archive states that no case studies are published, and presents no empty grid, no placeholder cards, and no filter that yields nothing

### Requirement: A card presents a case study's recorded facts and nothing else
A card SHALL present the case study's title, its description, its engagement category, its technology tags, its featured state, and its address. Each value SHALL be read from the case study's record. A card SHALL NOT present a fact the record does not state: a year, a role, a count, a duration, or a summary that the content does not contain. A card SHALL NOT present a value the owner did not write in order to fill a space.

#### Scenario: A card shows what the record states

- **WHEN** a card is presented for a case study
- **THEN** its title, description, category, and technology tags are exactly the values the case-study record holds

#### Scenario: A card omits a fact the record does not state

- **WHEN** a case study records no year and no role
- **THEN** its card presents no year and no role, and shows no placeholder, dash, or "not recorded" standing in for either

#### Scenario: No figure is written into a card

- **WHEN** a card's rendered output is inspected
- **THEN** it contains no numeric literal standing for a count, total, or duration, and every figure it shows is obtained from the content model

#### Scenario: The description is rendered as written

- **WHEN** a case study's description does not match its title or its technologies
- **THEN** the card presents the description verbatim rather than a corrected or summarised version of it

### Requirement: Technology tags are the case study's own technologies
A card SHALL present a tag for each technology the case study's record resolves to, labelled with that technology's canonical name. Tags SHALL be the resolved technology records rather than text parsed from the description. A case study with no technologies SHALL present no tag region rather than an empty one. A technology a case study does not declare SHALL NOT appear on its card, and the archive SHALL NOT infer a tag from prose.

#### Scenario: Declared technologies become tags

- **WHEN** a case study declares its technologies
- **THEN** its card presents one tag per declared technology, labelled with the canonical name of that technology's record

#### Scenario: A technology is labelled once, by its canonical name

- **WHEN** a technology record declares aliases
- **THEN** its tag reads the canonical name, so the same technology is not shown under two spellings on two cards

#### Scenario: No tags means no tag region

- **WHEN** a case study declares no technologies
- **THEN** its card presents no tag list and no empty region standing in for one

#### Scenario: A tag is not inferred from prose

- **WHEN** a case study's description names a technology its record does not declare
- **THEN** no tag is presented for it, because tags are declared rather than scraped

### Requirement: The featured state is the declared one
A card SHALL present a case study's featured state from the case study's declared featured marker, and SHALL NOT decide featuredness by any rule held in the archive. A case study carrying no featured marker SHALL be presented as unfeatured. The featured ordering, where one is offered, SHALL follow the declared order rather than the order records happen to appear in the content file.

#### Scenario: Featuredness follows the content

- **WHEN** a case study carries a featured marker
- **THEN** its card presents it as featured, and a case study carrying no marker is presented as unfeatured

#### Scenario: The archive holds no rule for choosing featured work

- **WHEN** the archive is inspected
- **THEN** it contains no rule that promotes a case study to featured, and marking a case study featured in the content needs no archive edit

#### Scenario: Declared order is the featured order

- **WHEN** case studies are ordered by featuredness
- **THEN** they follow the order their markers declare, not their order in the content file

### Requirement: Filters are derived from the records in use
The archive SHALL offer filters for engagement category and for technical domain. The set of options in each filter SHALL be derived from the published case studies that carry the value, and SHALL NOT be a list held in the archive or in any component. A filter option that no published case study carries SHALL NOT be offered. Category and domain SHALL be two separate filters rather than one combined list, because they describe different facts about a case study.

#### Scenario: Filter options come from the records

- **WHEN** the archive is rendered
- **THEN** every category and domain offered as a filter option is carried by at least one published case study, and no option is offered that no record carries

#### Scenario: The archive holds no list of categories or domains

- **WHEN** the archive's sources are inspected
- **THEN** no category or domain name appears as a literal in the archive or in the components it renders, and each is read from the content model

#### Scenario: Category and domain are separate filters

- **WHEN** the archive presents its filters
- **THEN** engagement category and technical domain are offered as two distinct filters, and a case study carrying both is reachable by either

#### Scenario: A domain that no case study carries is not offered

- **WHEN** the taxonomy permits a domain that no published case study declares
- **THEN** that domain is absent from the domain filter, so no control is shown that would yield an empty result

### Requirement: Filtering narrows the list to matching published case studies
Selecting a filter option SHALL present only the published case studies that declare the selected value, and SHALL leave the others unpresented. Selecting several values within one filter SHALL present the case studies declaring any of them. Filters in different groups SHALL combine, so a case study must satisfy every active filter to remain presented. The archive SHALL state how many case studies the active filters present, and that figure SHALL be the size of the presented set.

#### Scenario: A filter narrows the list

- **WHEN** a category is selected
- **THEN** only the published case studies declaring that category are presented

#### Scenario: Several values in one filter are a union

- **WHEN** two categories are selected
- **THEN** the case studies declaring either are presented, and one declaring both appears once

#### Scenario: Filters in different groups intersect

- **WHEN** a category and a domain are selected
- **THEN** only the case studies declaring both are presented

#### Scenario: The presented count is derived

- **WHEN** filters are active
- **THEN** the archive states a count equal to the number of case studies presented, and that count is obtained from the content model rather than authored

#### Scenario: Filters that match nothing say so

- **WHEN** the active filters match no published case study
- **THEN** the archive states that no case study matches, and presents no empty grid and no placeholder card

#### Scenario: Filters reset to the full list

- **WHEN** the visitor clears the filters
- **THEN** every published case study is presented again and the count equals the total

### Requirement: Sorting offers the orderings the content can support
The archive SHALL offer ordering by title, by featuredness, and by technology count. The title ordering SHALL be alphabetical and SHALL NOT depend on the order records appear in the content file. Technology-count ordering SHALL be derived from the number of technologies each case study resolves to. The archive SHALL NOT offer an ordering by date while no case study records one; an ordering that would place every case study in an arbitrary sequence because the field it orders by is absent is not offered.

#### Scenario: Title ordering is alphabetical

- **WHEN** the archive is ordered by title
- **THEN** the cards are presented alphabetically by the title the record holds

#### Scenario: Technology-count ordering is derived

- **WHEN** the archive is ordered by technology count
- **THEN** the cards are presented by the number of technologies each case study resolves to, in descending order

#### Scenario: A date ordering is not offered

- **WHEN** no published case study records a year
- **THEN** the archive offers no date ordering, rather than offering one that would order every case study identically or by an invented date

#### Scenario: A date ordering appears once the content supports it

- **WHEN** at least one published case study records a year
- **THEN** a date ordering is offered, ordering the case studies that state one by that year

#### Scenario: Ordering is a view of the same set

- **WHEN** an ordering is selected
- **THEN** the same case studies are presented as before, only in a different sequence, and the filters still apply

### Requirement: The archive is data-driven, server-rendered, and needs no scripting
The archive SHALL be rendered on the server, and its response SHALL already contain the final card set for the active filters and ordering. The archive SHALL NOT introduce a client component, and its content SHALL NOT be shipped to the browser as a data payload. Adding, unpublishing, or reclassifying a case study SHALL change the archive with no edit to the archive, its components, or any filter definition.

#### Scenario: The archive works without scripting

- **WHEN** the archive is fetched without executing client scripts
- **THEN** the card set for the active filters and ordering is present in the returned markup

#### Scenario: No client component is introduced

- **WHEN** the client directives across the application are enumerated
- **THEN** the archive route and the components it renders introduce no client component

#### Scenario: No content reaches the browser bundle

- **WHEN** the client bundle is inspected
- **THEN** it contains no case-study record, no derived filter set, and no serialised content index

#### Scenario: Content changes need no archive edit

- **WHEN** a case study is added, unpublished, reclassified, or given a different set of technologies
- **THEN** the archive reflects it on the next build, with no change to the archive route, its components, or the set of filter options

### Requirement: The archive is reachable and operable without a pointer
Every filter control SHALL be a destination rather than a scripted toggle, so that filtering is operable by keyboard and reachable as a link before any script runs. Each control SHALL carry an accessible name that states what it selects, and the archive SHALL expose its state to assistive technology as groups of controls rather than as an undifferentiated row. An applied filter SHALL be identified as the current one rather than only by colour. A card's destinations SHALL be marked as leaving the site where they do. The archive SHALL meet the responsive and landmark guarantees every other route meets.

#### Scenario: Filters are operable without scripting

- **WHEN** a filter control is followed as a link, with no client script executed
- **THEN** the request it names returns the filtered archive, so filtering does not depend on JavaScript

#### Scenario: Filters are operable by keyboard

- **WHEN** a visitor reaches the filter controls using only the keyboard
- **THEN** each control is focusable, follows to the filtered archive, and shows a visible focus indicator

#### Scenario: An applied filter is identified as current

- **WHEN** a filter option is active
- **THEN** it is exposed as the current destination, so its state is available to assistive technology and not only as a colour

#### Scenario: Each filter is a named group

- **WHEN** the filter controls are inspected
- **THEN** each filter is exposed as a group with an accessible name, so a visitor is told what a control selects before selecting it

#### Scenario: The archive meets the shell and layout guarantees

- **WHEN** the archive is rendered
- **THEN** it inherits the shell from the root layout with exactly one banner, one main region, and one contentinfo, and its cards reflow at small widths without horizontal scrolling
