## ADDED Requirements

### Requirement: A case study declares the technical domains it belongs to

A case study MAY declare the technical domains it belongs to, as a list of values drawn from a closed set of declared domains. The set SHALL be declared once and SHALL be the same set the model's type admits, so that adding a domain is a one-word edit rather than a change to any logic that filters or displays domains. The field SHALL be optional: a case study that belongs to no declared domain validates and is presented with no domain. A value outside the declared set SHALL fail the build.

The domain axis SHALL be independent of the engagement category. A category states the relationship the work was done under; a domain states what the work is about. Neither SHALL be derived from the other, and a case study's domains SHALL NOT be inferred from the technologies it declares, because a case study built on a cloud platform is not thereby about cloud.

#### Scenario: A declared domain is a value the set admits

- **WHEN** a case study declares a domain
- **THEN** the value is one the declared set contains, and the model's type for that field admits no other value

#### Scenario: A domain outside the set fails the build

- **WHEN** a case study declares a domain the set does not contain
- **THEN** the build fails naming the file, the record, and the field, and reports the permitted values

#### Scenario: A case study may declare no domain

- **WHEN** a case study leaves its domains empty
- **THEN** validation passes, the record is modelled with no domain, and no placeholder domain stands in for the absent one

#### Scenario: Domain and category are independent facts

- **WHEN** a case study declares a category and a domain
- **THEN** neither is derived from the other, and changing one leaves the other as declared

#### Scenario: A domain is not inferred from the technologies

- **WHEN** a case study declares a cloud platform among its technologies and no domain
- **THEN** it holds no cloud domain, because the domain is stated by the owner rather than read off the stack

#### Scenario: Adding a domain is a data edit

- **WHEN** a domain must be recognised that the set does not yet contain
- **THEN** it is added to the declared set, with no change to the logic that filters, counts, or displays domains

### Requirement: A derived figure describing a filtered set agrees with that set

Where the site displays a figure alongside a filtered or narrowed set of records, that figure SHALL be computed from the same records the set presents. A figure SHALL NOT be authored, and SHALL NOT be computed over a wider or narrower population than the one on screen. When a filter narrows a set, every figure shown alongside it SHALL describe the narrowed set.

#### Scenario: A filter's figure describes what is shown

- **WHEN** a filter narrows a list of records
- **THEN** the figure stated above that list equals the number of records presented, not the number before filtering

#### Scenario: A figure and the set it describes cannot disagree

- **WHEN** a record is added, unpublished, or reclassified
- **THEN** every figure describing the affected set is recomputed from the records, so no figure survives from a previous state of the content

#### Scenario: An empty set states zero rather than the unfiltered total

- **WHEN** a filter matches no record
- **THEN** the figure stated is zero, and the unfiltered total is not presented as though it described the empty set

## MODIFIED Requirements

### Requirement: Every statistic is derived, never authored

The system SHALL compute every displayed statistic from the content model. No statistic SHALL appear as a literal in any component, section, or page. A statistic SHALL be the result of a count, a distinct-value count, a date-range computation, or a declared taxonomy applied to the content. A statistic whose subject is a publishable thing SHALL count only what is published, so that a figure and the pages it describes cannot disagree.

#### Scenario: Adding content changes the numbers

- **WHEN** a case study is added to the case studies content file
- **THEN** the displayed case-study count increases and the unique-technology count is recomputed, with no edit to any component or page

#### Scenario: No numeric literal stands in for a derived value

- **WHEN** section and page sources are inspected
- **THEN** no statistic appears as a hardcoded number, and each is obtained from the derived-statistics interface

#### Scenario: Statistics are recomputed per build

- **WHEN** content changes and the site is rebuilt
- **THEN** every statistic reflects the new content, with no cached value carried over from a previous build

#### Scenario: A published figure counts only published records

- **WHEN** a case study is marked unpublished
- **THEN** the displayed case-study count excludes it, and every figure that named it agrees with that count

#### Scenario: Unique technologies are counted as identities

- **WHEN** two case studies name the same technology by two different spellings or aliases
- **THEN** the unique-technology count counts it once, and equals the number of technology records the count is derived from

#### Scenario: A count of a collection is not a figure the component owns

- **WHEN** a page displays how many records a collection holds or how many match a filter
- **THEN** the figure is obtained from the derived-statistics interface rather than computed in, or written into, the component that shows it
