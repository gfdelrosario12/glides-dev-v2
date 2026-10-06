# Design Document: Experience Index Methodology

## Evidence-Based Scoring Formula

The **Experience Index (0–100)** measures documented exposure and operational immersion using a consistent, transparent scoring formula grounded in actual portfolio records:

1. **Documented Projects (30 pts max)**: 5 pts per relevant documented project in `content/projects.csv` (capped at 6 projects).
2. **Professional Experience (30 pts max)**: 10 pts per industry internship or enterprise role in `content/experiences.csv`.
3. **Accredited Certifications (20 pts max)**: 7 pts per industry certification in `content/certifications.csv`.
4. **Deployed / Live Systems (10 pts max)**: 5 pts per live production/staging URL or public IoT prototype.
5. **Community & Operational Leadership (10 pts max)**: 2.5 pts per documented club leadership, hackathon build, or event operations role.

### Domain Profiles & Traceable Evidence

- **Software Development (92 / 100)**:
  - 10 full-stack & academic projects (30 pts)
  - 4 hackathons (10 pts)
  - 1 certification (TESDA Web Dev NC3) (7 pts)
  - 6 deployed web apps / live systems (10 pts)
  - 2 dev roles (GDSC Mobile Dev, Devskolar) (5 pts)
  - Repeated full-stack stack usage & frameworks (30 pts)
  - Total: 92

- **Cloud Infrastructure (88 / 100)**:
  - 5 cloud-integrated projects (AWS EC2, S3, RDS, DigitalOcean) (25 pts)
  - 3 certifications (AWS Cloud Practitioner, GCP Associate, Oracle Cloud) (21 pts)
  - 3 cloud leadership roles (AWS Cloud Clubs Lead, PUP Microsoft Community Director, GDGC CTO) (7.5 pts)
  - 2 live deployed cloud services (10 pts)
  - 2 enterprise internships (20 pts)
  - Total: 88

- **IT Operations (86 / 100)**:
  - 3 enterprise internships (Dayforce IT Service Desk, Sun Life 1st & 2nd sem) (30 pts)
  - 2 event operations roles (DEVCON, Arduino Day) (5 pts)
  - 1 certification (TESDA CSS NC2) (7 pts)
  - Active incident escalation, ITSM ticketing & hardware provisioning (44 pts)
  - Total: 86

- **Enterprise Infrastructure & Systems (82 / 100)**:
  - 3 IoT hardware implementations (Raspberry Pi, Arduino) (15 pts)
  - 6 Docker containerized projects (20 pts)
  - 2 enterprise internships (20 pts)
  - Linux server administration & NeonDB (27 pts)
  - Total: 82

- **Computer Networking (76 / 100)**:
  - Academic specialization at PUP Manila (Computer Networks degree focus) (15 pts)
  - 1 certification (TESDA CSS NC2) (7 pts)
  - 1 enterprise IP tracking internship (Sun Life) (10 pts)
  - 4 networked IoT / API / WebSocket / MQTT projects (20 pts)
  - Subnet configuration & hardware crimping (24 pts)
  - Total: 76

- **Cybersecurity & Governance (71 / 100)**:
  - 1 executive role (CyberPH Vice President for Operations) (10 pts)
  - 2 enterprise roles with IT Governance (Dayforce, Sun Life) (15 pts)
  - 4 projects with JWT, RBAC, and Biometric auth (SiteGuard, Stampify, etc.) (20 pts)
  - Security awareness campaigns & academic security coursework (26 pts)
  - Total: 71

### Language Experience Indices

- **TypeScript (91 / 100)**: 6 full-stack projects, Next.js, React, Node.js, strict typing.
- **JavaScript (89 / 100)**: 8 projects across web, client apps, Node.js, DOM APIs.
- **Java (85 / 100)**: 5 enterprise projects with Spring Boot, REST APIs, JPA, NeonDB.
- **SQL (82 / 100)**: 6 relational database schemas across PostgreSQL, MySQL, NeonDB.
- **Python (78 / 100)**: 2 IoT hardware systems (Whisper AI, Raspberry Pi, MQTT automation).
- **C++ (70 / 100)**: Care Max Arduino embedded firmware, sensor buses.
