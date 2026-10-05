## MODIFIED Requirements

### Requirement: The case study presents its recorded sections and states their absence

A case study's narrative SHALL be declared as a fixed set of named sections — overview, problem, architecture, implementation, infrastructure, security, challenges, results, and lessons learned — each holding prose. The set SHALL be declared once by the content model and SHALL be the same set the model's type admits, so that adding a section is a one-word edit rather than a change to the page. A present section SHALL render as paragraphs separated by blank lines and SHALL NOT be interpreted as Markdown or any other markup; no markup syntax SHALL render as formatting. An absent section SHALL be omitted, and the page SHALL NOT substitute generated, templated, or placeholder prose for it. Sections SHALL render in the order the model declares, so that two case studies read in the same shape and a section is never silently reordered into another's position.

#### Scenario: A present section renders as paragraphs

- **WHEN** a case study's `challenges` section contains three paragraphs separated by blank lines
- **THEN** three paragraphs render in order under that section's heading, and any character that would be markup syntax renders as the literal character it is

#### Scenario: Sections render in a declared order

- **WHEN** a case study declares several sections
- **THEN** they appear in the order the model declares, so that two case studies read in the same shape

#### Scenario: An absent section is omitted rather than filled

- **WHEN** a case study declares no `security` section
- **THEN** the page contains no security section, and no generated or templated prose stands in for the absent one

#### Scenario: No prose is invented for a case study

- **WHEN** a case study declares no narrative sections
- **THEN** the page presents the case study's other recorded fields and contains no narrative region at all

#### Scenario: A section is not silently reordered into another

- **WHEN** a case study declares `results` but not `challenges`
- **THEN** the results section renders where it belongs in the declared order, and no placeholder challenge section precedes it

#### Scenario: A section is presented by the same layout whichever section it is

- **WHEN** any declared section is rendered
- **THEN** its heading, prose, media, and snippets are presented by the same layout, so a case study does not gain a bespoke arrangement for one section

### Requirement: A case study page is rendered for each published case study

The project route SHALL render one page per published case study, addressed by that case study's declared slug, and SHALL present the case study's recorded fields. Routes SHALL be generated from the slugs the published case studies declare, so that a published case study is reachable without a route being written by hand and an unpublished one is not generated.

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

#### Scenario: Routes are generated from the declared slugs

- **WHEN** a case study is published
- **THEN** a route for its slug is generated with no route file added, and no route exists for a case study that is not published

#### Scenario: Absent domains are omitted rather than filled

- **WHEN** a case study declares no domain
- **THEN** its page presents no domain region and no placeholder domain stands in for the absent one

#### Scenario: A case study page offers the way back to the archive

- **WHEN** a case-study page is rendered
- **THEN** it offers a destination to the archive that lists every published case study, so a visitor who followed an address can reach the rest of the work without returning to the landing page first

### Requirement: A case study presents its media

A case study MAY declare media — an image with an alternative description, a source, the section it belongs to, and whether it is a diagram or a photograph. Media SHALL be presented from the model's declaration. A media item with no alternative description SHALL fail the build rather than rendering an image whose meaning is carried only by its pixels. Media SHALL be presented inside the section it declares, not in a single region gathered at the foot of the page, so that a figure appears with the argument it supports. A caption MAY be declared and SHALL be presented with the media it describes. This capability constrains what a case study may declare and present; it does not resize, convert, optimise, or serve the image, and introduces no image pipeline.

#### Scenario: Declared media is presented

- **WHEN** a case study declares an image with a source and an alternative description
- **THEN** the page presents that image with its alternative description available to assistive technology

#### Scenario: Media without a description fails the build

- **WHEN** a media item declares a source but no alternative description
- **THEN** the build fails naming the record and the media item, because an undescribed image conveys meaning only visually

#### Scenario: A case study without media shows none

- **WHEN** a case study declares no media
- **THEN** the page presents no media region and no placeholder image stands in for the absent one

#### Scenario: Media sources are validated like other addresses

- **WHEN** a media item declares a source that is not a resolvable address
- **THEN** the build fails naming the record and the media item

#### Scenario: Media appears in the section that declares it

- **WHEN** a media item declares the `infrastructure` section
- **THEN** it is presented within that section, and not gathered into a separate media region elsewhere on the page

#### Scenario: Media naming a section the model does not declare fails the build

- **WHEN** a media item declares a section outside the declared set
- **THEN** the build fails naming the record, the media item, and the permitted sections, because a figure with nowhere to appear would render as nothing

#### Scenario: A declared caption is presented with its media

- **WHEN** a media item declares a caption
- **THEN** the caption is presented with that media, and an absent caption is omitted rather than replaced by a placeholder

## ADDED Requirements

### Requirement: A case study presents its code snippets

A case study MAY declare code snippets, each belonging to one declared section and carrying a language, the code itself, and an optional caption. Snippet text SHALL be presented exactly as declared: its line breaks and indentation SHALL be preserved, and it SHALL NOT be interpreted as markup or any other syntax, so that a character in the code renders as that character. A snippet's language SHALL be presented so a visitor knows what language they are reading. Snippets SHALL be presented within the section they declare, in their declared order. The system SHALL NOT transform snippet text: no syntax highlighting, no re-indentation, no re-wrapping, and no truncation of long lines.

#### Scenario: A snippet is presented in the section that declares it

- **WHEN** a snippet declares the `implementation` section
- **THEN** it is presented within that section rather than gathered into a separate snippets region

#### Scenario: Snippet text is preserved exactly

- **WHEN** a snippet declares indentation, blank lines, and characters that would be markup syntax
- **THEN** each line renders with its own indentation, its blank lines are preserved, and every such character renders as the literal character it is

#### Scenario: A snippet states its language

- **WHEN** a snippet is presented
- **THEN** the language it declares is presented with it, so a visitor can tell what they are reading

#### Scenario: Snippets appear in their declared order

- **WHEN** a section declares several snippets
- **THEN** they are presented in the order their order values declare, and not in the order the rows happen to sit in the content file

#### Scenario: A snippet without a body fails the build

- **WHEN** a snippet declares no code
- **THEN** the build fails naming the record and the snippet, because an empty code block presents nothing while appearing to be something

#### Scenario: Snippet text is never transformed

- **WHEN** a snippet declares a long line or an unusual indentation
- **THEN** the line is presented unbroken and the indentation is unchanged, rather than being re-wrapped, re-indented, or shortened to fit

#### Scenario: A case study without snippets shows none

- **WHEN** a section declares no snippet
- **THEN** it presents no snippet region and no empty heading stands in for the absent one

### Requirement: The Architecture section leads with a diagram

Where a case study declares a diagram for the Architecture section, the diagram SHALL be presented before that section's prose and at a wider measure than a photograph. This expresses a preference for showing the shape of a system over describing it: the structure is the first thing a reader encounters. A case study with no diagram for Architecture SHALL present that section's prose with no diagram region and no placeholder standing in for one. This applies to the Architecture section only; other sections present media at the ordinary measure.

#### Scenario: A declared diagram precedes the section's prose

- **WHEN** a case study declares a diagram for the Architecture section
- **THEN** the diagram is presented above that section's prose, so a reader meets the structure before the description of it

#### Scenario: A diagram is presented wider than a photograph

- **WHEN** a section declares both a diagram and a photograph
- **THEN** the diagram occupies the wider slot and the photograph the ordinary one, so the two are distinguishable by their presentation and not only by their content

#### Scenario: Architecture without a diagram is prose alone

- **WHEN** a case study declares no diagram for the Architecture section
- **THEN** that section presents its prose with no diagram region, and nothing stands in for the absent diagram

#### Scenario: A photograph is not promoted to a diagram

- **WHEN** a media item declares itself a photograph
- **THEN** it is presented at the ordinary measure regardless of which section declares it, because the kind is declared rather than inferred from the image

### Requirement: A published case study is complete across the ten sections

A case study SHALL declare whether it is published. A case study that declares itself published SHALL declare every section in the declared ten-section structure, and at least one technology, or the build SHALL FAIL naming the case study and what it is missing. A case study that declares itself a draft SHALL be exempt, so that sections may be written incrementally. A case study's visibility SHALL NOT be a way to publish an incomplete record: a record that cannot satisfy the completeness rule cannot be published at all.

The tenth section, Technologies, SHALL be satisfied by declaring at least one technology rather than by holding prose, because its content is the case study's resolved technology records and not authored description. The other nine SHALL be satisfied by holding prose.

#### Scenario: A published case study missing a section fails the build

- **WHEN** a case study declares itself published and omits the `security` section
- **THEN** the build fails naming the file, the record, and the missing section, and no page is produced for it

#### Scenario: The failure names every section that is missing

- **WHEN** a published case study omits several sections
- **THEN** the build reports all of them at once, so the whole list is fixed in one pass rather than one section per build

#### Scenario: A published case study with no technology fails the build

- **WHEN** a case study declares itself published and declares no technology
- **THEN** the build fails naming the record and the missing technology, because the Technologies section would otherwise render empty

#### Scenario: A draft may be incomplete

- **WHEN** a case study declares itself a draft and omits several sections
- **THEN** validation passes, so sections can be written incrementally without the build blocking each intermediate state

#### Scenario: An incomplete record cannot be published by omission

- **WHEN** a case study omits its publication status
- **THEN** the build fails naming the field, because a record that does not state its visibility has not made the decision that completeness depends on

#### Scenario: A draft is reachable nowhere

- **WHEN** a case study is a draft
- **THEN** it has no page, appears in no listing, and is counted in no figure, so an incomplete record is never offered as somewhere to go

#### Scenario: Completing a record needs no code change

- **WHEN** a draft is brought up to the completeness rule and its status is changed to published
- **THEN** its page exists and the counts include it, with no edit to any component or route