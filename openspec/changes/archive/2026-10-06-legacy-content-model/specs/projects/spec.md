## Purpose

Defines the structure and presentation for the user's projects catalog.

## ADDED Requirements

### Requirement: Projects are parsed from CSV and displayed
The system SHALL parse `projects.csv` containing fields like `title`, `description`, `category`, `techStack`, `liveUrl`, and `githubUrl` and display them in a dedicated UI section.

#### Scenario: Displaying projects
- **WHEN** the user visits the home page or projects page
- **THEN** they see a list of projects with their title, description, and external links
