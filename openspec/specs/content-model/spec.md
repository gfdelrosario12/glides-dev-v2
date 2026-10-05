

## Purpose

Defines the site's content layer: where content lives, how collections and singleton prose are represented, how source data is parsed, normalised, and validated at build time, and how every statistic the interface displays is derived from that content rather than authored by hand.

## Requirements

### Requirement: Content lives inside the repository
All content required to render the site SHALL be stored within the repository. The system SHALL NOT read content from a path outside the repository at build time or at runtime, so that a deployed build is self-contained.

#### Scenario: A build does not depend on a sibling directory

- **WHEN** the site is built on a machine where no directory exists outside the repository
- **THEN** the build succeeds and every content-backed page renders fully populated

#### Scenario: Content paths resolve within the repository

- **WHEN** the content source files are located
- **THEN** every one of them is inside the repository root, and none is referenced by a path escaping that root

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
Every content file SHALL declare, per collection, which fields are required, which are optional, and which have a constrained value set. The system SHALL validate every record against that declaration, and the build SHALL FAIL on any violation, naming the file, the record, and the field. A field declared optional SHALL be validated exactly as strictly when it is present as when it is required, so that an optional field is not a loophole. Where a rule spans more than one record — a rule about a case study's completeness, or a reference from a media or snippet record to a section the model declares — the rule SHALL be validated across the collection as a whole, and the build SHALL FAIL naming every record that violates it rather than only the first.

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

#### Scenario: A cross-record rule reports every violating record

- **WHEN** several records each violate a rule that spans the collection
- **THEN** the build reports all of them in one failure, rather than stopping at the first and requiring one build per correction

#### Scenario: A reference to an undeclared target fails the build

- **WHEN** a record references a section the model does not declare
- **THEN** the build fails naming the file, the record, and the field, and reports the permitted values

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

#### Scenario: A count of a collection is not a figure the component owns

- **WHEN** a page displays how many records a collection holds or how many match a filter
- **THEN** the figure is obtained from the derived-statistics interface rather than computed in, or written into, the component that shows it

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

### Requirement: The section structure is declared once and referenced
A case study's narrative sections SHALL be declared as one ordered set in the content model, and the set SHALL be the same set the model's type admits, so that adding a section is a one-word edit rather than a change to any logic that renders, references, or validates sections. Media and snippet records SHALL reference that same set rather than naming a section in free text. No component, page, or validator SHALL hold its own list of section names: there SHALL be one declaration, and everything that needs a section reads it.

#### Scenario: One set is the source for rendering and for validation

- **WHEN** a section is added to the declared set
- **THEN** it becomes renderable, acceptable as a media or snippet section, and part of the completeness rule, with no change to any of those three

#### Scenario: A reference to an undeclared section fails the build

- **WHEN** a media or snippet record names a section that is not in the declared set
- **THEN** the build fails naming the record, the field, and the permitted sections

#### Scenario: No component holds a list of section names

- **WHEN** the section, media, and snippet sources are inspected
- **THEN** no section name appears as a literal outside the model's declaration, so the set cannot be stated twice and drift

#### Scenario: The declared order is the rendered order

- **WHEN** a case study declares several sections
- **THEN** they render in the order the declared set fixes, not in a case study's column order or the order records appear

### Requirement: Media declares the section it belongs to and what kind it is
A media record SHALL declare the section it belongs to and whether it is a diagram or a photograph, and MAY declare a caption. The kind SHALL be declared rather than inferred, so that a photograph is never presented as a diagram because of how it looks. A media record with no declared kind or no declared section SHALL fail the build.

#### Scenario: A media record states where it appears

- **WHEN** a media record is declared
- **THEN** it names the section it belongs to, and the page presents it within that section

#### Scenario: A media record states what it is

- **WHEN** a media record is declared
- **THEN** it names itself a diagram or a photograph, and the page presents it according to that declaration

#### Scenario: A kind outside the declared set fails the build

- **WHEN** a media record declares a kind the set does not contain
- **THEN** the build fails naming the record and reporting the permitted kinds

#### Scenario: A caption is optional and is not invented

- **WHEN** a media record declares no caption
- **THEN** validation passes and no caption is rendered, rather than a placeholder or a filename standing in for one

#### Scenario: A declared caption is content, not a filename

- **WHEN** a media record declares a caption
- **THEN** that caption is the text presented with the image, and no caption is derived from the file name or the alternative description

### Requirement: A code snippet is a record, not prose
A code snippet SHALL be a record in a declared collection, validated by the same rules as every other collection. Its text SHALL be stored and presented as declared: whitespace and line breaks are content, not formatting to be normalised, and the system SHALL NOT interpret, transform, or reformat it. On ingest, snippet text SHALL NOT be trimmed, collapsed, or re-indented, because a change to whitespace in a snippet is a change to the code.

#### Scenario: Snippet text is stored exactly as declared

- **WHEN** a snippet declares leading indentation, trailing blank lines, or repeated spaces inside a line
- **THEN** the stored text carries all three unchanged, and the same text is presented

#### Scenario: Snippet whitespace is not normalised

- **WHEN** a snippet's text is compared before and after loading the content
- **THEN** the two are identical, so no ingest step has altered the code

#### Scenario: A snippet is validated like any other record

- **WHEN** a snippet omits a required field or carries a value outside a permitted set
- **THEN** the build fails naming the file, the record, and the field, in the same form as any other collection's violation

#### Scenario: A snippet's collection is declared, not ad hoc

- **WHEN** the content model is inspected
- **THEN** the snippet collection is registered with its file, its fields, and their constraints, and a snippet cannot be read from a file the model does not declare

#### Scenario: A snippet's order is declared

- **WHEN** several snippets belong to one section
- **THEN** each declares an order value, and the order is a data edit rather than the order rows happen to appear in the file

#### Scenario: Snippet text carrying a quotation mark is representable

- **WHEN** a snippet declares code containing a quotation mark
- **THEN** it is stored and presented as that character, and the representation used in the content file does not require escaping the character in a way the parser does not support

#### Scenario: Malformed snippet text fails loudly

- **WHEN** snippet text is written in a way the parser cannot read
- **THEN** the build fails naming the file and the position, rather than producing a snippet whose text differs from what was declared

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


### Requirement: The model declares which fields are authorable gaps
The schema SHALL declare, per collection, which fields are authorable—fields whose absence means nobody has written them, rather than a legitimate stated state. The model SHALL derive an account of which records leave an authorable field empty, and which fields are empty on every record.

#### Scenario: Authorable fields are declared in the schema

- **WHEN** the schema is inspected
- **THEN** it explicitly declares authorable fields for each collection, distinguishing them from optional fields whose absence is a legitimate stated state

#### Scenario: Gaps are derived by the model

- **WHEN** the content model is queried for unwritten content
- **THEN** it returns a derived per-collection, per-field account of which records leave an authorable field empty
