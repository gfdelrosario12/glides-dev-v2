## Purpose

Defines the system for rendering detailed Markdown case studies linked from portfolio items.

## ADDED Requirements

### Requirement: Portfolio items link to Markdown case studies
Experiences, Certifications, and Projects SHALL act as gateways to detailed case study pages. The system SHALL parse Markdown files associated with these items and render them on a dynamic route, while preserving direct links to live sites and source code.

#### Scenario: Navigating to a detailed case study
- **WHEN** a visitor clicks on an experience, certification, or project card
- **THEN** they are navigated to a detailed case study page rendered from Markdown
