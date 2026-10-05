## Purpose

Defines the site's content layer: where content lives, how collections and singleton prose are represented, how source data is parsed, normalised, and validated at build time, and how every statistic the interface displays is derived from that content rather than authored by hand.

## ADDED Requirements

### Requirement: Content lives inside the repository

All content required to render the site SHALL be stored within the repository. The system SHALL NOT read content from a path outside the repository at build time or at runtime, so that a deployed build is self-contained.

#### Scenario: A build does not depend on a sibling directory

- **WHEN** the site is built on a machine where no directory exists outside the repository
- **THEN** the build succeeds and every content-backed page renders fully populated

#### Scenario: Content paths resolve within the repository

- **WHEN** the content source files are located
- **THEN** every one of them is inside the repository root, and none is referenced by a path escaping that root

### Requirement: Collections and singleton prose use different representations

Repeating collections — projects, experience, certifications, education — SHALL be stored as delimited text files, one record per row with a header row naming the fields. Content that is a single editorial record rather than a collection — the site identity, the biography, and the declared focus areas — SHALL be stored as a typed module so that its structure is checked by the compiler.

#### Scenario: Adding a project is a data edit

- **WHEN** a new project is appended to the projects content file with a value in every required field
- **THEN** it appears in the content model and in every derived statistic that counts projects, with no code change and no build configuration change

#### Scenario: Singleton prose is compiler-checked

- **WHEN** a required identity field is missing or misspelled in the typed identity module
- **THEN** type checking fails, rather than the omission surfacing as an empty element at runtime

#### Scenario: The split is by shape, not by convenience

- **WHEN** a new collection is introduced
- **THEN** it is stored as a delimited file, and only a genuinely singleton record is given a typed module

### Requirement: Source data is parsed without a third-party dependency

The system SHALL parse delimited content using parsing code contained in the repository. The system SHALL NOT add a runtime or build dependency for content parsing.

#### Scenario: Parsing adds no package

- **WHEN** the change is complete
- **THEN** the dependency manifest is unchanged from the project scaffold, and content parsing uses in-repo code only

#### Scenario: The parser handles real-world delimited input

- **WHEN** a field contains a comma, a double quote, or a line break
- **THEN** the value is recovered intact, and a literal double quote inside a quoted field is unescaped correctly

#### Scenario: A byte-order mark and mixed line endings are tolerated

- **WHEN** a content file begins with a byte-order mark or uses CRLF line endings
- **THEN** the first header name and every record parse correctly, with no stray character in the first field name

### Requirement: Headers and field values are normalised on ingest

The system SHALL trim leading and trailing whitespace from every header name and every field value, and SHALL normalise typographic quotation marks to their ASCII equivalents. Normalisation SHALL NOT alter the interior content of a value.

#### Scenario: A whitespace-corrupted header still resolves

- **WHEN** a content file declares a header name with leading whitespace, such as `&#32;&#32;year`
- **THEN** the field is addressable by its trimmed name, and reading it succeeds rather than failing with an unknown-key error

#### Scenario: Typographic apostrophes do not break matching

- **WHEN** a value contains a typographic apostrophe or quotation mark
- **THEN** classification and matching against that value behave identically to the ASCII equivalent

### Requirement: Records are validated at build time and a violation fails the build

Every content file SHALL declare, per collection, which fields are required, which are optional, and which have a constrained value set. The system SHALL validate every record against that declaration, and the build SHALL FAIL on any violation, naming the file, the record, and the field.

#### Scenario: A missing required field fails the build

- **WHEN** a record omits a field declared required for its collection
- **THEN** the build fails with an error naming the file, the record, and the missing field, and no page is produced

#### Scenario: A value outside the permitted set fails the build

- **WHEN** a record carries a value not permitted for a constrained field, such as an unrecognised project category
- **THEN** the build fails and reports the permitted values

#### Scenario: An optional field may be absent

- **WHEN** an optional field is absent or empty on a record
- **THEN** validation passes and the record is modelled with that value absent, not as an empty string

#### Scenario: Silent data loss is not possible

- **WHEN** a row has more fields than the header declares, or fewer
- **THEN** the build fails rather than discarding or shifting values into the wrong fields

### Requirement: The content model exposes typed, immutable records

The system SHALL expose the validated content as typed records with named, non-stringly-typed fields where a constrained set applies, and SHALL NOT expose the raw parsed rows. Consumers SHALL receive records they cannot accidentally mutate.

#### Scenario: Constrained fields are typed, not bare strings

- **WHEN** a project category is exposed
- **THEN** its type admits only the declared categories, and an unrecognised value is a compile-time error rather than a runtime surprise

#### Scenario: Consumers cannot mutate the content

- **WHEN** a component attempts to modify a record obtained from the content model
- **THEN** the attempt does not succeed, and the model is unaffected

### Requirement: Every statistic is derived, never authored

The system SHALL compute every displayed statistic from the content model. No statistic SHALL appear as a literal in any component, section, or page. A statistic SHALL be the result of a count, a distinct-value count, a date-range computation, or a declared taxonomy applied to the content.

#### Scenario: Adding content changes the numbers

- **WHEN** a project is added to the projects content file
- **THEN** the displayed project count increases and the distinct-technology count is recomputed, with no edit to any component or page

#### Scenario: No numeric literal stands in for a derived value

- **WHEN** section and page sources are inspected
- **THEN** no statistic appears as a hardcoded number, and each is obtained from the derived-statistics interface

#### Scenario: Statistics are recomputed per build

- **WHEN** content changes and the site is rebuilt
- **THEN** every statistic reflects the new content, with no cached value carried over from a previous build

### Requirement: Classification uses declared taxonomies that resolve to canonical values

Where a statistic requires classifying content — for example, deciding which cloud platforms appear in the portfolio — the classification SHALL be expressed as a declared taxonomy mapping aliases to canonical values, and the resulting count SHALL be of distinct canonical values.

#### Scenario: Aliases collapse to one canonical value

- **WHEN** the content mentions a cloud platform by two different aliases, such as `Azure` and `Microsoft Azure`
- **THEN** both resolve to a single canonical provider and the provider is counted once

#### Scenario: Taxonomy additions are data edits

- **WHEN** a new provider must be recognised
- **THEN** it is added to the declared taxonomy, with no change to the logic that computes the statistic

#### Scenario: Unknown values are not silently counted

- **WHEN** content matches no entry in the applicable taxonomy
- **THEN** it is not counted as a member of that taxonomy, and the omission is visible to the owner rather than being absorbed into an unrelated bucket

### Requirement: Durations and dates are parsed from real-world input

The system SHALL derive date information from the durations recorded in content, and SHALL support an open-ended duration denoting ongoing work. A duration that cannot be interpreted SHALL be reported rather than silently discarded.

#### Scenario: An open-ended duration is supported

- **WHEN** a duration denotes that the role or activity is ongoing
- **THEN** it is interpreted as extending to the present, and the derived span accounts for it

#### Scenario: A derived span is computed from the earliest start

- **WHEN** years of practice is derived
- **THEN** it is computed from the earliest start year present in the content to the present, rather than being stated in content or code

#### Scenario: An uninterpretable duration is reported

- **WHEN** a duration matches no recognised pattern
- **THEN** it is excluded from date-derived statistics and reported with its record identifier so the owner can correct it

### Requirement: Content access stays server-side

The content model SHALL be assembled and consumed on the server. Raw content files and the derived model SHALL NOT be shipped to the browser as a client-side data payload.

#### Scenario: Content is resolved during server rendering

- **WHEN** a content-backed page is requested
- **THEN** the content is read and the statistics computed on the server, and the rendered response already contains the final values

#### Scenario: No content payload reaches the browser bundle

- **WHEN** the client bundle is inspected
- **THEN** it contains no raw content records and no derived-statistics payload, only the code required for interactivity

### Requirement: Mechanical data defects are corrected at the source

Where a content file contains a mechanical defect — a corrupted header, a malformed link, or a typo in a constrained value — the defect SHALL be corrected in the content file itself. The system SHALL NOT implement a workaround that compensates for a known data defect at render time.

#### Scenario: A malformed link is corrected, not suppressed

- **WHEN** a project record carries a URL with a malformed suffix
- **THEN** the value is corrected in the content file and the rendered link is valid, rather than the field being hidden because it failed validation

#### Scenario: A constrained-value typo is corrected

- **WHEN** a constrained field holds a misspelled value
- **THEN** the content file is corrected to the permitted value, so that validation passes on its merits rather than by the schema being loosened

### Requirement: Content that is internally contradictory is surfaced, not rewritten

Where a record's descriptive prose contradicts its own structured fields, the system SHALL render the record faithfully and the discrepancy SHALL be reported to the owner. The system SHALL NOT author, infer, or rewrite descriptive prose about the owner.

#### Scenario: A mismatched description is rendered as written

- **WHEN** a record's description does not match its title or organisation
- **THEN** the description is rendered verbatim, and the discrepancy is reported separately rather than corrected or omitted

#### Scenario: No prose is invented

- **WHEN** a record lacks descriptive prose
- **THEN** no substitute prose is generated, and the absence is represented as absent