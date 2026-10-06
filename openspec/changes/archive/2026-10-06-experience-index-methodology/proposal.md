# Change Proposal: Experience Index Methodology

## Why

Generic percentage labels such as "Cloud — 95% proficiency" read as arbitrary and AI-generated. The numerical indicators (0–100) must instead represent a verifiable "Experience Index" derived from actual documented portfolio data (projects, certifications, industry internships, deployed systems, and organizational leadership) using an explainable, discoverable methodology.

## What Changes

1. **Experience Index Representation**:
   - Replace "proficiency" and "skill percentage" labels with `Experience Index` / `Technical Exposure`.
   - Compute scores using traceable portfolio evidence:
     - Cloud Infrastructure (88 / 100): 5 cloud projects, 3 certifications, 3 leadership roles, 2 deployed systems.
     - Software Development (92 / 100): 10 software projects, 4 hackathons, 6 full-stack systems, 1 credential.
     - IT Operations (86 / 100): 3 industry internships (Dayforce, Sun Life 1st & 2nd sem), 2 ops leadership roles.
     - Infrastructure & Systems (82 / 100): 3 IoT hardware prototypes, 6 containerized systems, 2 industry roles.
     - Networking (76 / 100): PUP Computer Engineering degree focus, TESDA CSS NC2, IP/subnet tracking, IoT protocols.
     - Cybersecurity (71 / 100): CyberPH VP for Operations, 4 RBAC/JWT implementations, IT governance.
   - For programming languages, present the circular telemetry gauge (0–100) with concrete project counts and verified usage.

2. **Discoverable Methodology Component**:
   - Add a subtle `[ ⓘ Methodology ]` interactive disclosure explaining the evidence formula, weighting, and data sources.

3. **Concrete Evidence Counters**:
   - Display itemized evidence on each domain card (e.g. `05 relevant projects · 03 certifications · 02 deployed systems`).

## Capabilities

### Modified Capabilities
- `infrastructure-expertise`: Updates the telemetry visualization to present the verifiable Experience Index and discoverable methodology.

## Impact
- Affects `components/sections/expertise.tsx` and related specs.
