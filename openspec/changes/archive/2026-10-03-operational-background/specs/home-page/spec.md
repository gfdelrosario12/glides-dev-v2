## MODIFIED Requirements

### Requirement: An education summary is presented from a content source
The landing page SHALL present an education summary covering each recorded qualification, and SHALL read it from the education content source. The education summary SHALL render each qualification's title, awarding institution, period, and specialisation. It SHALL offer a destination to the background timeline, and SHALL NOT present a second, differently-arranged presentation of the full study history that the timeline already presents.

#### Scenario: Every recorded qualification appears

- **WHEN** a qualification is added to the education content source
- **THEN** it appears in the education summary, and the count of displayed qualifications reflects the content

#### Scenario: Education renders without a bespoke layout

- **WHEN** the education summary is rendered
- **THEN** it is composed from the existing card and metadata primitives rather than a parallel set of education-only components

#### Scenario: Period and location read as machine-facing data

- **WHEN** a qualification's period and location are displayed
- **THEN** they render in the mono data face, consistent with other machine-facing strings on the page

#### Scenario: The summary leads to the full history rather than restating it

- **WHEN** the education summary is rendered
- **THEN** it offers a destination to the background timeline, and the detail paragraph of a record of study is not presented here, because the timeline presents it

#### Scenario: The landing page does not enumerate every experience

- **WHEN** the landing page is rendered
- **THEN** it presents no list of experience entries, and adding an experience adds nothing to the landing page