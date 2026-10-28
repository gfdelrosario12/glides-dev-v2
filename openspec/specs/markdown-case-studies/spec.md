# markdown-case-studies Specification

## Purpose
Defines the system for rendering detailed Markdown case studies linked from portfolio items.
## Requirements
### Requirement: Portfolio items link to Markdown case studies
Experiences, Certifications, and Projects SHALL act as gateways to detailed case study pages. Project activity SHALL link to a dynamic case-study route backed by a Markdown file in `content/case-studies-md`, while preserving direct links to live sites and source code. Each article SHALL be presented as a refined editorial publication following a standardized 10-part professional structure (Overview, Problem and Context, Objectives and Requirements, Approach and Process, Solution and Key Features, My Role and Contributions, Challenges and Decisions, Results and Validation, Lessons Learned and Future Improvements, and Closing and Project Links). The case study SHALL clearly identify personal contributions versus team scope, distinguish verified results from demonstration prototypes, avoid fabricated statistics or claims, and provide clear navigation back to the Projects listing.

#### Scenario: Navigating to a detailed case study
- **WHEN** a visitor clicks on an experience, certification, or project card
- **THEN** they are navigated to its case-study route, which reads the matching filesystem Markdown file and presents it in a polished editorial article layout

#### Scenario: Experience records open case studies
- **WHEN** a visitor activates an experience record
- **THEN** they are navigated to the case-study route for that experience

#### Scenario: Gateway affordance is visible
- **WHEN** a visitor hovers or focuses an experience, project, credential, or case-study gateway card
- **THEN** it reveals the text "Read my case study about this"

#### Scenario: Case-study content is pending
- **WHEN** the matching Markdown file is absent or empty
- **THEN** the case-study page shows an empty-content state and does not invent case-study details

#### Scenario: Returning from a case study
- **WHEN** a visitor activates the case-study back link
- **THEN** they return to the Projects section on the homepage

#### Scenario: Article reading navigation is available
- **WHEN** a visitor reads a case study article
- **THEN** they are provided with a reading progress indicator and a clear table of contents to jump between sections

