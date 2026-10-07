## Why

A major content rebranding pass is required to refine the portfolio's professional experience positioning. Rather than reading as generic help desk support or disconnected tasks, the entries must emphasize growing expertise in IT Operations, Infrastructure, Systems Administration, Cloud Infrastructure, Networking, Enterprise IT, Service Management, and Cybersecurity, reflecting the career progression trajectory from IT Service Management into IT Operations, Systems, and Cloud Infrastructure.

## What Changes

- **Refined IT Service Desk Intern (Dayforce Inc.)**: Repositioned description and responsibilities toward enterprise IT operations and infrastructure. Retained all 18 specified technical core areas: ServiceNow, incident management, hardware and software troubleshooting, Windows, network connectivity, authentication / SSO, Zscaler, Cisco AnyConnect VPN, Active Directory, Microsoft Intune, Microsoft 365, endpoint management, application installation and configuration, license provisioning, SLA management, cross-functional escalation, root-cause investigation, and enterprise technical support.
- **Normalized IT Service Management Intern Titles (Sun Life Global Solutions)**: Standardized both Sun Life records (`sun-life-itsm-intern-1` and `sun-life-itsm-intern-2`) to the canonical title `IT Service Management Intern`, eliminating redundancy with the independent `badgeLabel` UI badge (`Academic Internship`).
- **Refined IT Service Management Intern (Sun Life 2025)**: Emphasized server monitoring, infrastructure telemetry data, incident tracking/validation against SLAs, escalation, service management, and operational automation workflows using Power Apps and Power Automate.
- **Refined IT Service Management Intern (Sun Life 2024)**: Emphasized automated batch file generation, Excel VBA data validation pipelines, IP address validation, system records management, monitoring dashboards, SLA tracking, and infrastructure ticket triage.
- **Preserved Identity and Factuality**: Maintained all verified dates, companies, locations, and roles without title inflation, date alterations, or metric fabrication, ensuring seamless harmony with the broader software development and cloud engineering narrative.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `background`: Clarifies the title normalization rules for internship entries where the role title must not duplicate separate badge attributes (such as `badgeLabel`), and establishes the requirement that professional experience entries reflect their operational, infrastructure, systems administration, and service management scope.

## Non-goals

- Rewriting professional experience descriptions from scratch or inventing responsibilities/metrics not grounded in actual experience.
- Upgrading job titles (Dayforce remains `IT Service Desk Intern`, Sun Life remains `IT Service Management Intern`).
- Modifying employment dates, locations, or organization names.
- Altering hackathons, competitions, or organization leadership records.
- Redesigning UI layout components or modifying styling primitives.

## Impact

- `content/experiences.csv`: Source of truth for experience records updated for rows `sun-life-itsm-intern-1`, `sun-life-itsm-intern-2`, and `dayforce-it-service-desk-intern`.
- Rendered pages `/` (Landing page experience section) and `/background` (Background experience timeline).
