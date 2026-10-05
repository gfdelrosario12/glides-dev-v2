## Purpose

Provides a persistent global status indicator and an expandable panel reporting true operational metrics of the site and content.

## ADDED Requirements

### Requirement: Global status indicator shows operational pulse
The system SHALL display a global status indicator containing a subtle operational pulse animation. This indicator SHALL be visible across the application to signify system health.

#### Scenario: Status indicator is visible
- **WHEN** a user visits any page on the site
- **THEN** the global status indicator is visible, displaying a subtle pulse

### Requirement: Expandable status panel reports true metrics
When interacted with, the status indicator SHALL expand to reveal a panel containing real application and content metrics (such as the number of case studies, credentials, or other available content counts).

#### Scenario: Panel expands on interaction
- **WHEN** a user interacts with the global status indicator
- **THEN** a panel expands to display detailed metrics

#### Scenario: Metrics are unfabricated
- **WHEN** the status panel is viewed
- **THEN** the metrics displayed are derived from the actual content model or application state, and no fake uptime or fabricated health scores are presented
