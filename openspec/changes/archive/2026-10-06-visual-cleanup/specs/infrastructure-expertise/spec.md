## Purpose

Visually represents technical focus areas and expertise as an interconnected, sliding infrastructure diagram rather than generic numerical progress bars.

## ADDED Requirements

### Requirement: Expertise is visualized as a connected infrastructure topology
The system SHALL display the user's technical domains (e.g., Cloud, Networking, Security) as a horizontal, sliding system of interconnected nodes. It SHALL NOT use arbitrary percentages to denote objective skill level, but instead use terms like "FOCUS" or "DEPTH" or treat the loaders simply as a system initialization metaphor.

#### Scenario: Scrolling into the expertise section
- **WHEN** the section enters the viewport
- **THEN** a subtle initialization sequence begins, establishing connections and sliding nodes into position before settling into a stable state

### Requirement: The visualization is interactive and horizontally navigable
The visualization SHALL allow users to shift focus between different domains horizontally, maintaining the feel of navigating an infrastructure diagram rather than a standard carousel.

#### Scenario: Navigating between domains
- **WHEN** a user interacts to view an adjacent technical domain
- **THEN** the active domain shifts into focus while the topology adjusts subtly without breaking the connection lines
