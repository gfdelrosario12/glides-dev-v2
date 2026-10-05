## RENAMED Requirements

- FROM: `Durations and dates are parsed from real-world input`
- TO: `Dates are declared as dates, not as prose`

## MODIFIED Requirements

### Requirement: Collections and singleton prose use different representations

Repeating collections — case studies, case-study media, technologies, social links, experience, certifications, education — SHALL be stored as delimited text files, one record per row with a header row naming the fields. Content that is a single editorial record rather than a collection — the profile, the biography, and the declared focus areas — SHALL be stored as a typed module so that its structure is checked by the compiler.

#### Scenario: Adding a project is a data edit

- **WHEN** a new case study is appended to the case studies content file with a value in every required field
- **THEN** it appears in the content model and in every derived statistic that counts case studies, with no code change and no build configuration change

#### Scenario: Singleton prose is compiler-checked

- **WHEN** a required profile field is missing or misspelled in the typed profile module
- **THEN** type checking fails, rather than the omission surfacing as an empty element at runtime

#### Scenario: A social link is a collection, not navigation

- **WHEN** a social link is added
- **THEN** it is stored as a row in the social links content file and appears in both navigations and in the footer from that one declaration, with no navigation edit

#### Scenario: The split is by shape, not by convenience

- **WHEN** a new collection is introduced
- **THEN** it is stored as a delimited file, and only a genuinely singleton record is given a typed module

### Requirement: Records are validated at build time and a violation fails the build

Every content file SHALL declare, per collection, which fields are required, which are optional, and which have a constrained value set. The system SHALL validate every record against that declaration, and the build SHALL FAIL on any violation, naming the file, the record, and the field. A field declared optional SHALL be validated exactly as strictly when it is present as when it is required, so that an optional field is not a loophole.

#### Scenario: A missing required field fails the build

- **WHEN** a record omits a field declared required for its collection
- **THEN** the build fails with an error naming the file, the record, and the missing field, and no page is produced

#### Scenario: A value outside the permitted set fails the build

- **WHEN** a record carries a value not permitted for a constrained field, such as an unrecognised case-study category or publication status
- **THEN** the build fails and reports the permitted values

#### Scenario: An optional field may be absent

- **WHEN** an optional field is absent or empty on a record
- **THEN** validation passes and the record is modelled with that value absent, not as an empty string

#### Scenario: An optional field present is validated as strictly as a required one

- **WHEN** an optional field is present but holds a malformed value
- **THEN** the build fails naming the field, rather than the value passing because the field was not required

#### Scenario: An out-of-order date fails the build

- **WHEN** a record declares an end date earlier than its start date
- **THEN** the build fails naming the file, the record, and the date fields, because the span it implies cannot exist

#### Scenario: Silent data loss is not possible

- **WHEN** a row has more fields than the header declares, or fewer
- **THEN** the build fails rather than discarding or shifting values into the wrong fields

### Requirement: The content model exposes typed, immutable records

The system SHALL expose the validated content as typed records with named, non-stringly-typed fields where a constrained set applies, and SHALL NOT expose the raw parsed rows. Consumers SHALL receive records they cannot accidentally mutate. Where one record refers to another, the model SHALL expose the referred-to record rather than the reference string that named it.

#### Scenario: Constrained fields are typed, not bare strings

- **WHEN** a case-study category is exposed
- **THEN** its type admits only the declared categories, and an unrecognised value is a compile-time error rather than a runtime surprise

#### Scenario: Consumers cannot mutate the content

- **WHEN** a component attempts to modify a record obtained from the content model
- **THEN** the attempt does not succeed, and the model is unaffected

#### Scenario: A reference resolves to the record it names

- **WHEN** a consumer reads a certification's related case study
- **THEN** it receives the case-study record itself, and does not have to look the reference up by hand

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

### Requirement: Classification uses declared taxonomies that resolve to canonical values

Where a statistic requires classifying content — deciding which cloud platforms appear in the portfolio, or which technology a mention refers to — the classification SHALL be expressed as a declared taxonomy mapping aliases to canonical values, and the resulting count SHALL be of distinct canonical values.

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

### Requirement: Dates are declared as dates, not as prose

The system SHALL store dates as dates, in a form the system can compare and order, rather than as a human-readable string it must re-parse. The precision the content states SHALL be carried through to the model rather than invented, so a value recorded only to the month is not rendered as a day. A role or a qualification that is ongoing SHALL leave its end date absent, which is how the system distinguishes an open span from an omitted one. A date that matches no recognised format SHALL fail the build rather than pass through as text.

#### Scenario: A span is comparable without parsing prose

- **WHEN** two records declare spans that overlap in time
- **THEN** the system determines the overlap from the declared dates, without interpreting either span as text

#### Scenario: An open-ended span is declared as absent

- **WHEN** a role or qualification is ongoing
- **THEN** its end date is absent, and the derived span accounts for it as reaching the present

#### Scenario: A derived span is computed from the earliest start

- **WHEN** years of practice is derived
- **THEN** it is computed from the earliest start date present in the content to the present, rather than being stated in content or code

#### Scenario: An uninterpretable date is reported

- **WHEN** a date field matches no recognised format
- **THEN** the build fails naming the file, the record, and the field, rather than the value passing through as text

## ADDED Requirements

### Requirement: A case study declares whether it is published

Every case study SHALL declare a publication status from a closed set of values. The status SHALL decide whether the case study is published: a published case study is addressed, navigable, and counted; an unpublished one is none of those. The status SHALL be declared in the content and SHALL NOT be decided by any component or by a list maintained outside the content.

#### Scenario: A published case study is addressable and counted

- **WHEN** a case study declares itself published
- **THEN** it has a page at its address, and it is included in the counts of case studies

#### Scenario: An unpublished case study has no page

- **WHEN** a case study declares itself unpublished and its address is requested
- **THEN** the site returns its not-found response, the same response it returns for an address no case study declares

#### Scenario: An unpublished case study is not offered anywhere

- **WHEN** a case study is unpublished
- **THEN** no navigation, listing, count, or command offers it as somewhere to go

#### Scenario: Publishing needs no code change

- **WHEN** a case study's status is changed to published
- **THEN** its page exists and the counts include it, with no edit to any component, route, or command

#### Scenario: An absent status is not a way to publish

- **WHEN** a case study omits its publication status
- **THEN** the build fails naming the field, because a case study's visibility must be stated rather than defaulted

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

### Requirement: A technology is an identified thing, not a spelling

Every technology mentioned as a technology — by a case study, or by an experience's tools or systems
— SHALL correspond to a technology record, carrying a canonical name, a category, and any aliases
that resolve to it. Such a mention SHALL resolve to its technology record, and the set of
technologies SHALL be countable as identities rather than as distinct spellings.

A capability, activity, or skill stated in prose SHALL NOT be required to be a technology. Where a
record states what someone is skilled at rather than what a system is built from, that list SHALL
remain free of technology records, and a figure counting technologies SHALL NOT include it.

#### Scenario: One technology, one record

- **WHEN** a technology is used by several case studies and by an experience
- **THEN** they all reference one technology record, and the technology is counted once

#### Scenario: A mention resolves through a declared alias

- **WHEN** content mentions a technology by one of its declared aliases
- **THEN** the mention resolves to that technology's record

#### Scenario: A technology with no record is reported

- **WHEN** content mentions a technology that has no record
- **THEN** the build fails naming the mention and the record that is missing, rather than the mention becoming an untracked technology

#### Scenario: The technology list is not assembled by scraping prose

- **WHEN** the site's technologies are listed
- **THEN** the list is the declared technology records filtered to those in use, and not a scan of the text of every record

#### Scenario: A skill is not a technology

- **WHEN** an experience records a capability such as communication or service management
- **THEN** that capability is not counted as a technology and requires no technology record, so the unique-technology figure counts things built rather than things practised

#### Scenario: A stack value that is not a specific technology is kept and classified

- **WHEN** a case study records a practice or a field rather than a specific technology
- **THEN** it is retained as a declared technology record whose category says so, rather than dropped or silently replaced with a name the owner did not write

### Requirement: A record of study distinguishes the credential from its discipline

A record of study SHALL store the credential it represents — the degree, diploma, or strand — and the
discipline or fields of study separately, so that a record naming a qualification does not require
its discipline to be parsed back out of its title. A record that states no credential level SHALL
leave that field absent rather than have one invented for it. Dates SHALL be the declared start and
end of the study, not a prose span.

#### Scenario: Credential and discipline are separate facts

- **WHEN** a record of study is stored
- **THEN** the credential level and the discipline are independent fields, so a title need not contain its discipline to be readable

#### Scenario: A record stating no degree level is recorded as such

- **WHEN** a record states a strand rather than a degree or diploma
- **THEN** the credential-level field is absent, validation passes, and no placeholder credential level is shown in its place

#### Scenario: Discipline is a list, not one joined value

- **WHEN** a record of study names several fields of study
- **THEN** each is stored as its own entry rather than one delimited string that a consumer must split

### Requirement: A certification records the credential, not just its year

A certification SHALL record the credential it represents: its issuer as an organisation distinct from its title, the date it was acquired, and, where the credential has one, the date it expires and a credential identifier. A credential that does not expire SHALL leave its expiration absent. Whether a credential is verifiable SHALL be expressible as a destination a visitor can follow, and SHALL NOT be implied by the record's mere existence.

#### Scenario: Issuer and title are separate facts

- **WHEN** a certification is recorded
- **THEN** the organisation that issued it is stored independently of its title, so a credential's title is not required to contain its issuer

#### Scenario: Acquisition is a date, not a year

- **WHEN** a certification records when it was acquired
- **THEN** the model holds a full date, so an expiry can be compared against it

#### Scenario: An absent expiration means the credential does not lapse

- **WHEN** a certification declares no expiration
- **THEN** it is modelled as not expiring, and is not modelled as expiring at an unknown date

#### Scenario: An expiry before acquisition fails the build

- **WHEN** a certification declares an expiration earlier than its acquisition
- **THEN** the build fails naming the record and both dates

#### Scenario: A credential identifier is optional

- **WHEN** a certification carries no credential identifier
- **THEN** validation passes, and no placeholder identifier is shown in its place

### Requirement: Social links are content, declared once and rendered everywhere

Every social destination the site offers SHALL be declared as a content record carrying the platform, the display label, and the address. The shared navigation definition and the footer SHALL both render from that declaration. A social destination SHALL NOT be hardcoded in a component, and the navigation definition SHALL NOT declare one independently of the content.

#### Scenario: One declaration feeds every surface

- **WHEN** a social link is added to the content
- **THEN** it appears in the desktop navigation, the mobile navigation, and the footer, with no component edit

#### Scenario: The navigation holds no social destination of its own

- **WHEN** the shared navigation definition is inspected
- **THEN** it contains no social destination, so there is no second declaration that could disagree with the content

#### Scenario: A social link is not a site route

- **WHEN** a social destination is rendered
- **THEN** it is identified as leaving the site and opens in a new browsing context, because it is not a destination on this site

#### Scenario: A social destination that does not open another site is not labelled as one

- **WHEN** a social destination opens the visitor's mail application rather than a website
- **THEN** it is not marked as leaving the site, because the rule that marks a destination external is the declared fact and not an inference from the address scheme

### Requirement: The owner's identity is one profile record

The owner's name, role, summary, biography, and portrait SHALL be held as a single profile record
rather than as separate exported values. Every consumer SHALL read the profile record, so that the
identity shown in one place cannot disagree with the identity shown in another. The profile SHALL
state no figure; every number attributed to the owner SHALL come from the derived statistics.

#### Scenario: One record feeds every surface

- **WHEN** the owner's name or role is displayed in the hero, the footer, or the colophon
- **THEN** each reads the same profile record, with no second declaration that could disagree

#### Scenario: The profile states no number

- **WHEN** the profile record is inspected
- **THEN** it holds no count, total, or span of years, because a figure written into content is one that can disagree with the records it describes

#### Scenario: A misspelled profile field fails before it is published

- **WHEN** the profile record omits or misspells a field
- **THEN** type checking fails, rather than the omission rendering as an empty space at runtime
