## RENAMED Requirements

- FROM: `Every project declares a routable slug`
- TO: `Every published case study declares a routable slug`

## MODIFIED Requirements

### Requirement: Every published case study declares a routable slug

Every case study SHALL declare a `slug` field, which SHALL be a lowercase, hyphen-separated identifier, SHALL be unique across the case-study collection, and SHALL be the case study's addressable segment under the project route. The slug SHALL be declared in the content file and SHALL NOT be derived from the case study's title at render time. A slug SHALL be addressable only while its case study is published.

#### Scenario: A case study is addressable by its declared slug

- **WHEN** a published case study declares `slug` as `guardian-vision`
- **THEN** it is addressable at the segment `/projects/guardian-vision`

#### Scenario: A missing or malformed slug fails the build

- **WHEN** a case study omits its slug, or its slug is empty, uppercase, or contains a space or an underscore
- **THEN** the build fails with an error naming the file, the record, and the slug field, and no page is produced

#### Scenario: Two case studies declaring the same slug fails the build

- **WHEN** two case-study records declare the same slug
- **THEN** the build fails and names both records, because one of them would be unreachable at its address

#### Scenario: Renaming a title does not break the address

- **WHEN** a case study's title is edited and its slug is not
- **THEN** the case study's address is unchanged and its page still resolves

#### Scenario: Unpublishing withdraws the address

- **WHEN** a case study that is published at a slug becomes unpublished
- **THEN** that segment returns the not-found response, and no page is served at it

### Requirement: A case study page is rendered for each published case study

The project route SHALL render one page per published case study, addressed by that case study's declared slug, and SHALL present the case study's recorded fields.

#### Scenario: A declared slug renders its case study

- **WHEN** the project route is requested with a slug a published case study declares
- **THEN** a page is returned presenting that case study's recorded title, category, year, role, technologies, external destinations, and narrative sections

#### Scenario: An unrecognised slug returns the not-found response

- **WHEN** the project route is requested with a slug no case study declares
- **THEN** the site returns its not-found response, and does NOT redirect to the index, render an empty page, or render a different case study

#### Scenario: An unpublished slug returns the not-found response

- **WHEN** the project route is requested with a slug an unpublished case study declares
- **THEN** the site returns the same not-found response it returns for an unrecognised slug, so an unpublished case study is not discoverable by guessing its address

#### Scenario: Every published case study has a reachable page

- **WHEN** the set of slugs of published case studies is compared with the set of published case-study records
- **THEN** they are the same size, so no published case study is left without an address

### Requirement: The case study presents its recorded sections and states their absence

A case study SHALL declare its narrative as named sections — overview, problem, architecture, implementation, infrastructure, security, challenges, results, and lessons learned — each holding prose. Each section SHALL be optional. A present section SHALL render as paragraphs separated by blank lines and SHALL NOT be interpreted as Markdown or any other markup; no markup syntax SHALL render as formatting. An absent section SHALL be omitted, and the page SHALL NOT substitute generated, templated, or placeholder prose for it. A page whose case study declares no sections at all SHALL present the case study's other recorded fields and contain no narrative region.

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

### Requirement: A case study marks its external destinations

Any destination on a case-study page that leaves the site — a project's live or source destination, a credential's verification destination — SHALL open in a new browsing context, SHALL carry a relationship that prevents the opened page reaching back, and SHALL be identified as leaving the site to assistive technology. External destinations SHALL come from the case study's declared destinations, and a destination SHALL NOT be rendered that the model does not declare.

#### Scenario: External project links are marked

- **WHEN** a case-study page renders a live or source destination
- **THEN** the link opens in a new browsing context, carries `rel="noopener noreferrer"`, and its accessible name states that it opens in a new tab

#### Scenario: Internal destinations are not marked as external

- **WHEN** a destination resolves to a path on this site
- **THEN** it is not given new-tab treatment and is not marked as leaving the site

#### Scenario: A destination with no address is not rendered as a link

- **WHEN** a case study declares a destination with no address, such as a project with no public repository
- **THEN** the page omits it rather than rendering a link that goes nowhere

#### Scenario: An undeclared destination is not rendered

- **WHEN** a case-study page is inspected
- **THEN** every external link on it corresponds to a destination the case study declares, and the page invents none

## ADDED Requirements

### Requirement: A case study presents its media

A case study MAY declare media — an image with an alternative description and a source. Media SHALL be presented from the model's declaration. A media item with no alternative description SHALL fail the build rather than rendering an image whose meaning is carried only by its pixels. This capability constrains what a case study may declare and present; it does not resize, convert, optimise, or serve the image, and introduces no image pipeline.

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

### Requirement: A case study links to the records it relates to

A case-study page SHALL present the certifications and experience records that declare a relationship to it, resolved through the content model rather than matched on titles. Each related record SHALL link to wherever that record is presented elsewhere on the site. A case study with no related records SHALL present no related-records region.

#### Scenario: Related records are resolved from the model

- **WHEN** a case study is rendered
- **THEN** the certifications and experience records it relates to are presented, and each is reached through the relationship declared on that record

#### Scenario: The relationship is stated once

- **WHEN** a certification declares a relationship to a case study
- **THEN** the case-study page presents that certification without the certification's own record also having to declare the reverse relationship by hand

#### Scenario: No related records means no region

- **WHEN** no certification or experience record relates to a case study
- **THEN** the page contains no related-records region and no empty heading stands in for it

#### Scenario: A related count is derived

- **WHEN** a case-study page states how many related records it has
- **THEN** that count is computed from the content model, and is not written into the page
