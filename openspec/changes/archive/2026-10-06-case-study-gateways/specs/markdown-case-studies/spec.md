## MODIFIED Requirements

### Requirement: Portfolio items link to Markdown case studies
Experiences, Certifications, and Projects SHALL act as gateways to detailed case study pages. Experience records SHALL link to the same dynamic case-study route as projects. Gateway cards SHALL reveal the prompt "Read my case study about this" on hover or focus. Project activity SHALL link to a dynamic case-study route backed by a Markdown file in `content/case-studies-md`, while preserving direct links to live sites and source code. When the Markdown file is absent or empty, the route SHALL render a concise empty-content state rather than generated placeholder prose. A case-study page SHALL provide a back link to the homepage Projects section.

#### Scenario: Navigating to a detailed case study
- **WHEN** a visitor clicks on an experience, certification, or project card
- **THEN** they are navigated to its case-study route, which reads the matching filesystem Markdown file

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
