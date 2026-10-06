## MODIFIED Requirements

### Requirement: Entries are grouped into professional, hackathons, and organizations
Each experience SHALL declare which kind of work it represents, and the `/background` route SHALL present experiences in three distinct sections: Professional Experience, Hackathons & Competitions, and Organizations & Community. Each category SHALL have its own dedicated semantic `<section>` element, heading, and description.

#### Scenario: Categorized experiences presentation
- **WHEN** a visitor views the experiences section on the background route
- **THEN** experiences are rendered in separate semantic sections for Professional Experience, Hackathons & Competitions, and Organizations & Community
