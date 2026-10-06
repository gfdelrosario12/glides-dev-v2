## MODIFIED Requirements

### Requirement: Experiences and certifications are parsed from legacy CSV format
The system SHALL parse `experiences.csv` and `certifications.csv` using the user's legacy field schema rather than the strict v2 dates and tracks.

#### Scenario: Displaying experiences with duration strings
- **WHEN** the timeline UI renders an experience
- **THEN** it displays the raw `duration` string (e.g., "September 2024 - September 2025") instead of relying on parsed `startDate` and `endDate`

#### Scenario: Displaying certifications
- **WHEN** the credentials UI renders a certification
- **THEN** it maps the legacy fields correctly
