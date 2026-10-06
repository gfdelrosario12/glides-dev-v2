## Context

The user requested:
1. Separate organizations, hackathons, and professional experience in the experiences section.
2. Add "IT Service Desk Intern - Dayforce Inc. from July 2026 to December 2026" under professional experience.

## Decisions

### 1. Data Model
- Add row in `content/experiences.csv`:
  `dayforce-it-service-desk-intern,professional,IT Service Desk Intern,Dayforce Inc.,Internship,2026-07,2026-12,"Ortigas, Pasig City","Handled enterprise IT service desk operations, incident troubleshooting, infrastructure support requests, and user provisioning.",Handled enterprise IT service desk operations | Resolved software and hardware incident requests | Provided technical user support and escalations,,Service Management | Technical Support | IT Operations | Enterprise Systems,,,`
- Verify track values:
  - `professional`: Sun Life (1st & 2nd Semester), Dayforce Inc.
  - `technical` (Hackathons): Diwata Overcode, TechUP Hackathon, TON Hackers League, UP Socompscie.
  - `organizations` (`leadership`, `community`, `event-operations`, or null track): CyberPH, ICPEP SE, DEVCON, Arduino Day, GDGC PUP, GDSC PUP, AWS Cloud Clubs, PUP MSC, Java User Groups, KakaComputer, The Programmer's Guild, TedxUPV.

### 2. UI Presentation
- In `components/sections/experience-timeline.tsx`:
  - Add category tabs or segmented controls:
    `[ All (21) ] [ Professional (3) ] [ Hackathons (4) ] [ Organizations (14) ]`
  - Allow visitors to seamlessly switch between categories or see each clearly partitioned group.
  - Keep the responsive mobile-friendly vertical timeline layout with dates, titles, badges, and organizations.
- In `app/background/page.tsx`:
  - Present groups structured clearly so Professional Work, Hackathons, and Organizations are immediately distinct.
