## MODIFIED Requirements

### Requirement: Expertise is visualized as a connected infrastructure topology and circular language telemetry

The system SHALL display technical domains in an "Expertise Summary" section. Numerical scores (0–100) SHALL represent an "Experience Index" derived from verifiable portfolio evidence (documented projects, industry roles, certifications, and deployed systems) rather than arbitrary skill claims. The methodology SHALL be discoverable via an interactive explanation component, and each domain card SHALL display its underlying evidence counts. Programming languages SHALL be presented with circular telemetry gauges (0–100) with color-coded status rings, and SHALL remain responsive without horizontal overflow, text clipping, or overlapping content across narrow mobile widths down to 320px.

#### Scenario: Viewing Expertise Summary
- **WHEN** a visitor reaches the expertise section
- **THEN** they see Expertise Summary with domain Experience Index scores, evidence counters, interactive methodology disclosure, and circular progress indicators for programming languages

#### Scenario: Reading a proficiency level
- **WHEN** a visitor inspects one expertise field
- **THEN** the field has an accessible slider label and a visible percentage level

#### Scenario: Programming language telemetry on narrow mobile screens
- **WHEN** the programming languages telemetry section is viewed on viewports from 320px to 480px
- **THEN** each language card fits its container without horizontal overflow, the circular gauge is top-aligned, titles and scores wrap gracefully, and domain and evidence descriptions wrap cleanly without clipping
