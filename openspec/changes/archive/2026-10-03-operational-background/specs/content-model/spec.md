## MODIFIED Requirements

### Requirement: Classification uses declared taxonomies that resolve to canonical values
Where a statistic requires classifying content — deciding which cloud platforms appear in the portfolio, or which technology a mention refers to — the classification SHALL be expressed as a declared taxonomy mapping aliases to canonical values, and the resulting count SHALL be of distinct canonical values. A field whose values name the subject areas a record covers SHALL likewise be validated against a vocabulary declared once in the schema, rather than accepted as free text, so that every classification rendered on the site is one the site recognises. A field classifying a record by the kind of work it represents SHALL be declared with the same strictness, and a vocabulary whose values cannot be told apart by a reader SHALL NOT be introduced in place of a broader one that could.

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

#### Scenario: A record's kind of work is declared, and absent is a real value

- **WHEN** a record declares the kind of work it represents
- **THEN** the value is checked against the declared set, an unrecognised value fails the build naming it, and a record declaring none is valid and is presented as unclassified rather than assigned one

#### Scenario: No value claims a kind of work it does not

- **WHEN** a declared kind would be satisfied by every record that could plausibly hold it
- **THEN** it is not introduced, because a classification that cannot exclude anything does not classify

### Requirement: A record of study distinguishes the credential from its discipline
A record of study SHALL store the credential it represents — the degree, diploma, or strand — and the
discipline or fields of study separately, so that a record naming a qualification does not require
its discipline to be parsed back out of its title. A record that states no credential level SHALL
leave that field absent rather than have one invented for it. Dates SHALL be the declared start and
end of the study, not a prose span. A record of study SHALL carry an addressable segment declared on
the record, so that it can be linked to directly and so that a corrected title does not move it.

#### Scenario: Credential and discipline are separate facts

- **WHEN** a record of study is stored
- **THEN** the credential level and the discipline are independent fields, so a title need not contain its discipline to be readable

#### Scenario: A record stating no degree level is recorded as such

- **WHEN** a record states a strand rather than a degree or diploma
- **THEN** the credential-level field is absent, validation passes, and no placeholder credential level is shown in its place

#### Scenario: Discipline is a list, not one joined value

- **WHEN** a record of study names several fields of study
- **THEN** each is stored as its own entry rather than one delimited string that a consumer must split

#### Scenario: A study record is addressable

- **WHEN** a record of study declares an addressable segment
- **THEN** it is used to address that record rather than a segment derived from its title

## ADDED Requirements

### Requirement: An experience record states what kind of work it represents
An experience SHALL declare the kind of work it represents from a declared set covering
professional work, technical work, leadership, community work, and event operations, and
SHALL NOT declare a value so broad that it distinguishes nothing. The former classification
values SHALL be removed, so a record cannot continue to declare one. Every value in the set
SHALL be meaningful for at least one recorded experience.

#### Scenario: The declared set is the five kinds the record set needs

- **WHEN** the experience track vocabulary is inspected
- **THEN** it names professional, technical, leadership, community, and event operations, and nothing broader than those

#### Scenario: A record declaring no kind is valid

- **WHEN** an experience declares no kind of work
- **THEN** validation passes, and the record is presented as unclassified rather than being omitted or assigned one

#### Scenario: A record declaring a former value fails the build

- **WHEN** an experience declares a value that the previous classification used
- **THEN** the build fails naming the file, the record, and the value, because the field it belonged to no longer exists

#### Scenario: A kind with no recorded experience is not kept

- **WHEN** a declared kind is held by no recorded experience
- **THEN** it is a signal that the vocabulary is wider than the record set, and it is reviewed rather than left to accumulate

### Requirement: An experience states what it learned, when it can
An experience MAY declare a lesson learned from the work. The field SHALL be optional, and an
experience declaring none SHALL validate and SHALL present no lesson. A lesson SHALL NOT be
derived from the experience's other fields.

#### Scenario: A declared lesson is stored as written

- **WHEN** an experience declares a lesson learned
- **THEN** it is stored and presented as declared

#### Scenario: No lesson is a valid state

- **WHEN** an experience declares no lesson learned
- **THEN** validation passes and no lesson is presented in its place

#### Scenario: No lesson is written on the owner's behalf

- **WHEN** no experience declares a lesson
- **THEN** the absence is visible to the owner as content to write, and no lesson is synthesised from the experience's description

### Requirement: A record's address is declared, not derived from its display name
Where a record is addressable by its own entry or page, the addressable segment SHALL be
declared as a field on the record rather than derived from a display field. A declared
address SHALL be unique across its collection, SHALL be validated as a slug, and correcting
a record's display name SHALL NOT change its address.

#### Scenario: The address is the declared slug

- **WHEN** a record declares an addressable segment
- **THEN** its entry or page is addressed by that segment, and not by one derived from its title

#### Scenario: A display name may be corrected without moving the entry

- **WHEN** a record's role title is corrected
- **THEN** its segment is unchanged and existing links to it keep working

#### Scenario: Two records cannot share one address

- **WHEN** two records in one collection declare the same addressable segment
- **THEN** the build fails naming both records, because one address would be ambiguous

#### Scenario: An address containing punctuation is rejected

- **WHEN** a record declares an addressable segment containing a space or punctuation
- **THEN** the build fails naming the record and the segment, rather than percent-encoding it into an address nobody would type