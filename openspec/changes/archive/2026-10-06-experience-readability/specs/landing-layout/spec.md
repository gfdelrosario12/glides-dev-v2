## MODIFIED Requirements

### Requirement: The landing page features a specific section order and strictly controls terminal usage
The landing page SHALL prioritize concrete achievements by moving the infrastructure expertise, education, experience timeline, and certifications sections ahead of the projects section. The experience timeline SHALL present organization-to-profession progression from the validated experience records. The landing page SHALL expose one welcoming connect gateway rather than duplicate social/contact lists. The terminal UI component SHALL ONLY be used once, within the Hero section, and SHALL NOT be duplicated or repeated in other sections or in a global shell overlay.

#### Scenario: Viewing the landing page narrative flow
- **WHEN** a visitor scrolls down the home page
- **THEN** they see the Hero, expertise, education, experience timeline, certifications, projects, and one connect gateway in document order

#### Scenario: Reading the experience timeline
- **WHEN** a visitor reaches the experience section
- **THEN** each recorded experience is presented with its organization, role, track, period, and location in a vertical timeline

#### Scenario: Viewing the landing page terminal usage
- **WHEN** a visitor scrolls down the home page
- **THEN** they encounter only one literal terminal component in the Hero and no below-footer or header-mounted terminal surface
