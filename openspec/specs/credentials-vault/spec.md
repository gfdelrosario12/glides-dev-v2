## Purpose

Presents the owner's recorded credentials as a listing and a set of detail pages that a visitor can inspect and check, with verification state stated honestly rather than implied by an unlabelled link.

## Requirements

### Requirement: The vault lists every recorded credential
The system SHALL provide a `/credentials` route that presents every credential in the
content model, in a single declared order, and SHALL add exactly one entry for that route
to the shared navigation definition. Individual credential pages SHALL NOT appear in the
navigation, so the number of navigation items does not depend on the number of
credentials.

#### Scenario: Every recorded credential is listed

- **WHEN** the `/credentials` route is rendered
- **THEN** every credential in the content model appears exactly once, in the declared order

#### Scenario: Navigation names the vault once

- **WHEN** the shared navigation definition is inspected
- **THEN** it contains one entry whose destination is the vault, and no entry whose destination is a credential address

#### Scenario: Adding a credential adds no navigation item

- **WHEN** a seventh credential is recorded
- **THEN** it appears on the listing and the navigation item count is unchanged

#### Scenario: An empty content model yields an empty page, not an error

- **WHEN** the `/credentials` route is rendered and the content model records no credential
- **THEN** the page renders, states that none are recorded, and presents no card

### Requirement: A credential card presents its recorded facts and nothing else
The vault SHALL present each credential as a card carrying its title, issuer, acquisition
date, verification state, and any skills it declares. A card SHALL link to that
credential's detail page. A card SHALL NOT present prose the content does not declare,
and a card SHALL NOT render a placeholder for an absent optional field.

#### Scenario: A card carries the credential's recorded facts

- **WHEN** a credential card is rendered
- **THEN** it presents the credential's title, issuer, acquisition date, verification state, and declared skills

#### Scenario: A card links to its detail page

- **WHEN** a credential card is rendered
- **THEN** it offers a destination to that credential's detail page, addressed by the credential's declared slug

#### Scenario: Absent optional facts are omitted

- **WHEN** a credential declares no expiry and no skills
- **THEN** its card presents neither an expiry nor a skills region, and no placeholder stands in for the absent one

### Requirement: A credential detail page is rendered for each credential
The system SHALL render a `/credentials/[slug]` page for each recorded credential,
addressed by that credential's declared slug. The page SHALL be rendered on the server
and SHALL introduce no client component. A slug that no credential declares and a slug
that no longer resolves SHALL produce the same not-found response.

#### Scenario: A declared slug renders its credential

- **WHEN** `/credentials/[slug]` is requested with a slug a credential declares
- **THEN** a page is returned presenting that credential's recorded title, issuer, description, dates, skills, verification state, and related case studies

#### Scenario: An unrecognised slug returns the not-found response

- **WHEN** `/credentials/[slug]` is requested with a slug no credential declares
- **THEN** the site returns its not-found response, and does not redirect, render an empty page, or render a different credential

#### Scenario: Pages are generated without a route being written by hand

- **WHEN** a credential is added to the content
- **THEN** a route for its slug is generated with no route file added

#### Scenario: The detail page carries no client component

- **WHEN** the credential detail page is rendered
- **THEN** the whole credential is present in the initial response and no credential field is shipped to a client bundle

### Requirement: Verification state is stated, not implied by an unlabelled link
Each credential SHALL declare whether its recorded verification destination identifies
that credential specifically or the owner's profile listing. The page SHALL label the
destination accordingly, so a link to a profile is never presented as verification of
the credential. The system SHALL NOT present a verification claim for a credential whose
content declares none.

#### Scenario: A direct destination is labelled as verification

- **WHEN** a credential declares a destination identifying that credential
- **THEN** the page presents it as a destination to verify the credential

#### Scenario: A profile destination is labelled as the profile

- **WHEN** a credential declares a destination identifying the owner's profile listing rather than the credential
- **THEN** the page presents it as a destination to the owner's profile, and does not describe it as verifying that credential

#### Scenario: An undeclared verification claim is not made

- **WHEN** a credential declares no verification destination
- **THEN** the page presents no verification destination and no verified state

#### Scenario: The destination leaves the site and says so

- **WHEN** a verification destination is presented
- **THEN** it opens in a new browsing context and states that it does, and its address is available as text rather than as a hidden link target

### Requirement: Verification state is legible without colour
A credential's verification state SHALL be presented as a shape plus a visible text
label, with colour applied only as reinforcement, and SHALL NOT be conveyed by a
coloured mark alone. A credential whose recorded expiry has passed or falls within the
declared warning window SHALL be presented as needing attention rather than as verified.
The state label SHALL be derived from the recorded dates, never authored.

#### Scenario: Verification state survives a greyscale rendering

- **WHEN** the verification state is viewed in a greyscale rendering
- **THEN** the state is still identifiable from its shape and its text label

#### Scenario: An expiring credential is not presented as verified

- **WHEN** a credential declares an expiry that has passed
- **THEN** its state is presented as needing attention, and not as verified

#### Scenario: A credential with no expiry is not presented as expiring

- **WHEN** a credential declares no expiry
- **THEN** no expiry state is presented, and the absence of an expiry is not rendered as a warning

#### Scenario: The state label is derived, not authored

- **WHEN** the verification state is computed
- **THEN** it follows from the recorded dates and verification destination, and no content field states the state directly

### Requirement: A credential presents the case studies that evidence it
A credential page SHALL present the case studies that declare a relationship to it,
derived from those records rather than maintained on the credential. A credential that
no case study names SHALL render no related-work region and no placeholder.

#### Scenario: Related case studies resolve to the records

- **WHEN** a credential names one or more case studies
- **THEN** the page presents those case studies by title, and each links to its own page

#### Scenario: The relationship is stated once

- **WHEN** the relationship between a credential and a case study is inspected
- **THEN** it is declared on one side, and the credential's side is derived rather than maintained by hand

#### Scenario: An unevidenced credential renders no region

- **WHEN** no case study names a credential
- **THEN** its page presents no related-work region and no placeholder heading

### Requirement: A credential's skills come from a declared vocabulary
The skills a credential covers SHALL be validated against a vocabulary declared once in
the schema, so that every value on the page is one the site recognises. A value outside
the vocabulary SHALL fail the build naming the file, the record, and the offending value.

#### Scenario: A declared skill is accepted

- **WHEN** a credential declares a skill present in the declared vocabulary
- **THEN** validation passes and the skill is presented

#### Scenario: An undeclared skill fails the build

- **WHEN** a credential declares a skill absent from the declared vocabulary
- **THEN** the build fails naming the file, the record, and the offending value, and names the permitted values

#### Scenario: A new skill is a vocabulary edit

- **WHEN** a credential must declare a skill the vocabulary does not contain
- **THEN** the skill is added to the declared vocabulary, with no change to the logic that presents skills

#### Scenario: One bad skill does not hide the valid ones

- **WHEN** a credential declares one skill outside the vocabulary beside valid ones
- **THEN** the build names the invalid one, and the record's valid skills are not what caused the failure
