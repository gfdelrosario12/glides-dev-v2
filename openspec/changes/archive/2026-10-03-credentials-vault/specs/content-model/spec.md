## MODIFIED Requirements

### Requirement: Classification uses declared taxonomies that resolve to canonical values
Where a statistic requires classifying content — deciding which cloud platforms appear in the portfolio, or which technology a mention refers to — the classification SHALL be expressed as a declared taxonomy mapping aliases to canonical values, and the resulting count SHALL be of distinct canonical values. A field whose values name the subject areas a record covers SHALL likewise be validated against a vocabulary declared once in the schema, rather than accepted as free text, so that every classification rendered on the site is one the site recognises.

#### Scenario: Aliases collapse to one canonical value

- **WHEN** the content mentions a cloud platform by two different aliases, such as `Azure` and `Microsoft Azure`
- **THEN** both resolve to a single canonical provider and the provider is counted once

#### Scenario: Taxonomy additions are data edits

- **WHEN** a new provider must be recognised
- **THEN** it is added to the declared taxonomy, with no change to the logic that computes the statistic

#### Scenario: Unknown values are not silently counted

- **WHEN** content matches no entry in the applicable taxonomy
- **THEN** it is not counted as a member of that taxonomy, and the omission is visible to the owner rather than being absorbed into an unrelated bucket

#### Scenario: A technology's aliases are declared, not inferred

- **WHEN** a technology record declares aliases
- **THEN** every mention matching one of them resolves to that record, and a mention matching nothing is reported rather than becoming a new technology

#### Scenario: A record's subject areas are validated against a declared vocabulary

- **WHEN** a record declares the subject areas it covers
- **THEN** every value is checked against the vocabulary declared for that field, and a value outside it fails the build naming the file, the record, and the offending value

#### Scenario: Every bad value in one cell is reported

- **WHEN** a cell holds two values that are both outside the declared vocabulary
- **THEN** both are named in the same build failure, so one build reports the whole cell

#### Scenario: A subject-area vocabulary is declared once and referenced

- **WHEN** a second field classifies records by the same kind of subject area
- **THEN** it references the same declared vocabulary rather than restating it, so the vocabulary has one definition

### Requirement: Records reference each other by identity, and a dangling reference fails the build
Where one record declares that it relates to another — a certification to the work it evidences, an experience to the projects it involved — the reference SHALL name the referred record's addressable identity rather than repeat its title or description. Every reference SHALL be checked at build time. A reference naming a record that does not exist SHALL fail the build.

#### Scenario: A relationship resolves to the record

- **WHEN** a consumer reads a certification's related case studies
- **THEN** it receives the case-study records themselves, and does not have to match on titles

#### Scenario: A dangling reference fails the build

- **WHEN** a record references a case study that no case study declares
- **THEN** the build fails naming the file, the record, and the unresolved reference, because the relationship would render as nothing

#### Scenario: A reference is not duplicated text

- **WHEN** a relationship is declared on one side
- **THEN** it is stated once, and the reverse relationship is derived rather than maintained by hand on the other record

#### Scenario: A relationship is not required

- **WHEN** a record declares no relationship to any case study
- **THEN** validation passes, and the page presents the record with no related work rather than a placeholder

## ADDED Requirements

### Requirement: A record's address is declared, not derived from its display name
Where a record is addressable by its own page, the addressable segment SHALL be declared as a field on the record rather than derived from a display field. A declared address SHALL be unique across its collection, SHALL be validated as a slug, and correcting a record's display name SHALL NOT change its address.

#### Scenario: The address is the declared slug

- **WHEN** a record declares an addressable segment
- **THEN** its page is served at that segment, and not at a segment derived from its title

#### Scenario: A display name may be corrected without moving the page

- **WHEN** a record's title is corrected
- **THEN** its address is unchanged and its page is still reachable at the address it was first published under

#### Scenario: Two records cannot share one address

- **WHEN** two records in one collection declare the same addressable segment
- **THEN** the build fails naming both records, because one address would be ambiguous

#### Scenario: An address containing punctuation is rejected

- **WHEN** a record declares an addressable segment containing a space or punctuation
- **THEN** the build fails naming the record and the segment, rather than percent-encoding it into an address nobody would type

### Requirement: A record's verification state is declared by what it can be checked against
Where a record can be checked by an outside party, the record SHALL declare both the destination a visitor can follow and what that destination identifies — the record itself or the owner's listing of it. The declared kind SHALL be validated against a declared set. The system SHALL NOT present a verification claim for a destination that does not identify the record, and SHALL NOT invent a destination the content does not declare.

#### Scenario: The declared kind matches the destination

- **WHEN** a record declares a destination that identifies that record
- **THEN** it declares the kind accordingly, and the kind is one of the declared values

#### Scenario: A kind outside the declared set fails the build

- **WHEN** a record declares a verification kind that is not declared
- **THEN** the build fails naming the file, the record, and the offending value, and names the permitted kinds

#### Scenario: A listing destination is not presented as verification

- **WHEN** a record declares a destination that identifies the owner's listing rather than the record
- **THEN** the record is not presented as verified on the strength of that destination

#### Scenario: No destination means no claim

- **WHEN** a record declares no verification destination
- **THEN** no verification state is presented for it, rather than a default or assumed one