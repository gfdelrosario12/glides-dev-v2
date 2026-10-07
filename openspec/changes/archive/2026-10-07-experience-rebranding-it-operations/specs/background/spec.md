## MODIFIED Requirements

### Requirement: An entry presents the operational record, not only the role
An experience entry SHALL present its organization, role, period, role shape, the work as
recorded, and the responsibilities, tools, and systems it declares. A declared field SHALL
be presented where the record supplies one. An absent optional field SHALL be omitted
rather than rendered as a placeholder. The role title SHALL represent the clean job title
without redundantly duplicating separate badge attributes (such as `badgeLabel`), and
professional experience descriptions SHALL accurately articulate the systems administration,
infrastructure operations, service management, and enterprise technical support scope of the role.

#### Scenario: The declared detail is presented

- **WHEN** an experience declares responsibilities, tools, or systems
- **THEN** the entry presents each declared one

#### Scenario: Absent detail is omitted, not announced as missing

- **WHEN** an experience declares no responsibilities, tools, or systems
- **THEN** the entry presents no region for them and no placeholder standing in for the absent one

#### Scenario: The recorded account of the work is presented

- **WHEN** an experience entry is rendered
- **THEN** it presents the record's own description of the work, transcribed as written and not summarised or reworded

#### Scenario: Professional role titles do not duplicate badge labels

- **WHEN** an experience record is rendered with a distinct `badgeLabel` (such as `Academic Internship`)
- **THEN** the role title displays the clean job title (such as `IT Service Management Intern`) without duplicating the badge text in the title string

#### Scenario: Operational and infrastructure capabilities are preserved

- **WHEN** the professional internships are rendered
- **THEN** Dayforce presents enterprise IT operations, endpoint administration, and network troubleshooting competencies, and Sun Life presents server monitoring, infrastructure data pipelines, and service management automation

#### Scenario: A lesson learned is presented when declared

- **WHEN** an experience declares a lesson learned
- **THEN** the entry presents it under its own heading

#### Scenario: No lesson learned means no heading

- **WHEN** an experience declares no lesson learned
- **THEN** the entry presents no heading for one
