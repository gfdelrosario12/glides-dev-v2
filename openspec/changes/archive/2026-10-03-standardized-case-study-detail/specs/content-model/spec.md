## MODIFIED Requirements

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

## ADDED Requirements

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