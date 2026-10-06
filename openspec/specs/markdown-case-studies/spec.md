# markdown-case-studies Specification

## Purpose
Defines the system for rendering detailed Markdown case studies linked from portfolio items.

## Requirements

### Requirement: Portfolio items link to Markdown case studies
Experiences, Certifications, and Projects SHALL act as gateways to detailed case study pages. Project activity SHALL link to a dynamic case-study route backed by a Markdown file in `content/case-studies-md`, while preserving direct links to live sites and source code. When the Markdown file is absent or empty, the route SHALL render a concise empty-content state rather than generated placeholder prose.

#### Scenario: Navigating to a detailed case study
- **WHEN** a visitor clicks on an experience, certification, or project card
- **THEN** they are navigated to its case-study route, which reads the matching filesystem Markdown file

#### Scenario: Case-study content is pending
- **WHEN** the matching Markdown file is absent or empty
- **THEN** the case-study page shows an empty-content state and does not invent case-study details
