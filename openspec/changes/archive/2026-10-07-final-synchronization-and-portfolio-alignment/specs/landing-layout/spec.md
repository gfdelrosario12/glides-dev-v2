## MODIFIED Requirements

### Requirement: The landing page presents distinct categories for experiences
The landing page SHALL feature three dedicated, distinct sections for experiences:
1. Professional Experience (Industry internships at Dayforce Inc. and Sun Life Global Solutions)
2. Hackathons & Competitions (Diwata Overcode, TechUP, TON Hackers League, UP Socompscie, PUP Techfest, PUP Uthack)
3. Student Organizations & Community Leadership (CyberPH, ICPEP SE, DEVCON, Arduino Day, GDGC PUP, GDSC PUP, AWS Cloud Clubs, PUP MSC, Java User Groups, KakaComputer, The Programmer's Guild, TedxUPV)

Each section SHALL be an independent `<section>` element with its own heading, description, verified timeline entries, and links to markdown case studies.

#### Scenario: Navigating independent experience sections
- **WHEN** a visitor scrolls through the landing page
- **THEN** they encounter Professional Experience, Hackathons & Competitions, and Organizations & Community as separate, dedicated sections in document order

#### Scenario: Viewing the landing page terminal usage
- **WHEN** a visitor scrolls down the home page
- **THEN** they encounter only one literal terminal component in the Hero and no below-footer or header-mounted terminal surface

### Requirement: Landing sections stack adaptively without horizontal overflow
The landing page sections (Hero, Embedded Terminal, Education, Timeline, Projects, Focus Areas, and Calls to Action) SHALL employ responsive flex and grid layouts that progressively evolve from single-column mobile compositions to multi-column desktop arrangements. When any component or layout collapses into a single-column layout on mobile, the component SHALL be centered to preserve visual balance. Long strings, code, and badges SHALL wrap or scroll intentionally without causing page-wide horizontal overflow.

#### Scenario: Mobile hero and terminal viewport
- **WHEN** a user visits the home page on a mobile device
- **THEN** identity and primary action are visible in the first viewport, the terminal scales appropriately and is centered, and text wraps cleanly

#### Scenario: Timeline and project cards on touch devices
- **WHEN** a user views experience entries or project cards on mobile
- **THEN** cards stack cleanly in chronological order, single-column elements are centered, tap targets for links are easily touchable, and secondary actions do not overlap
