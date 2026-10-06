## Purpose

Visually represents technical focus areas and expertise as an interconnected, sliding infrastructure diagram rather than generic numerical progress bars.

## Requirements

### Requirement: Expertise is visualized as a connected infrastructure topology and circular language telemetry
The system SHALL display technical domains in an "Expertise Summary" section. Numerical scores (0–100) SHALL represent an "Experience Index" derived from verifiable portfolio evidence (documented projects, industry roles, certifications, and deployed systems) rather than arbitrary skill claims. The methodology SHALL be discoverable via an interactive explanation component, and each domain card SHALL display its underlying evidence counts. Programming languages SHALL be presented with circular telemetry gauges (0–100) with color-coded status rings.

#### Scenario: Viewing Expertise Summary
- **WHEN** a visitor reaches the expertise section
- **THEN** they see Expertise Summary with domain Experience Index scores, evidence counters, interactive methodology disclosure, and circular progress indicators for programming languages

#### Scenario: Reading a proficiency level
- **WHEN** a visitor inspects one expertise field
- **THEN** the field has an accessible slider label and a visible percentage level

### Requirement: Expertise visualization adapts to touch devices and vertical mobile flow
The infrastructure expertise and skillset section SHALL render as a cohesive system across screen sizes. On small screens, nodes SHALL stack in a vertical dependency sequence with clear calibrated metrics and readable summaries, rather than cramped horizontal columns.

#### Scenario: Viewing expertise on mobile
- **WHEN** a user scrolls to the expertise section on a mobile screen
- **THEN** each technical domain card presents legible status and metrics without requiring mouse hover
