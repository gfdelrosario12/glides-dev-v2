## Purpose

Visually represents technical focus areas and expertise as an interconnected, sliding infrastructure diagram rather than generic numerical progress bars.

## Requirements

### Requirement: Expertise is visualized as a connected infrastructure topology
The system SHALL display the user's technical domains as an infrastructure expertise and skillset view. Each domain SHALL have a labeled proficiency slider and a visible level, while retaining a concise explanation of the field. The section SHALL present Infrastructure map as its framing label and SHALL remain readable without relying on animation.

#### Scenario: Viewing infrastructure expertise
- **WHEN** a visitor reaches the expertise section
- **THEN** they see Infrastructure expertise with labeled sliders for infrastructure, cloud, cybersecurity, networking, and IT operations

#### Scenario: Reading a proficiency level
- **WHEN** a visitor inspects one expertise field
- **THEN** the field has an accessible slider label and a visible percentage level
