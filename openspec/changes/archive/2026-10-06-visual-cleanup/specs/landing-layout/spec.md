## MODIFIED Requirements

### Requirement: The landing page features a specific section order and strictly controls terminal usage
The landing page SHALL prioritize concrete achievements by organizing sections logically. Crucially, the terminal UI component SHALL ONLY be used once, within the Hero section, and SHALL NOT be duplicated or repeated in other sections. The terminal metaphor must be expressed differently (e.g., as infrastructure topologies or timelines) elsewhere.

#### Scenario: Viewing the landing page narrative flow
- **WHEN** a visitor scrolls down the home page
- **THEN** they encounter only one literal terminal component (in the Hero), followed by differently visualized sections (Statistics/Expertise, Education, etc.) that do not reuse the terminal component
