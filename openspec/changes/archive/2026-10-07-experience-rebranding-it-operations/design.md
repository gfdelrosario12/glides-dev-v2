## Context

The portfolio presents career history across both landing page highlights (`/`) and a dedicated `/background` operational timeline. The previous professional internship descriptions placed heavy emphasis on generic help desk support wording, slightly obscuring deep technical exposure to enterprise infrastructure, identity governance, endpoint management, networking, and service monitoring.

The data source of truth is `content/experiences.csv`. To ensure accurate representation of Gladwin's trajectory into IT Operations, Systems Administration, and Cloud Infrastructure, the copy for Dayforce Inc. and Sun Life Global Solutions must be repositioned without changing dates, company names, or underlying factual responsibilities.

## Goals / Non-Goals

**Goals:**
- Shift tone from basic help desk to enterprise IT operations, infrastructure, systems administration, and service management.
- Standardize Sun Life titles to `IT Service Management Intern`, eliminating redundancy with the badge UI element (`Academic Internship`).
- Explicitly retain all 18 core technical terms in the Dayforce entry: ServiceNow, incident management, hardware and software troubleshooting, Windows, network connectivity, authentication / SSO, Zscaler, Cisco AnyConnect VPN, Active Directory, Microsoft Intune, Microsoft 365, endpoint management, application installation and configuration, license provisioning, SLA management, cross-functional escalation, root-cause investigation, and enterprise technical support.
- Maintain full schema compliance (`lib/content/schema.ts`), test suites (`node --test lib/content/*.test.ts`), and build checks (`npm run build`).

**Non-Goals:**
- Inventing responsibilities, metrics, or technologies not present in the user's authentic work history.
- Changing dates, companies, locations, or track categories.
- Changing visual components, layouts, or CSS tokens.

## Decisions

### 1. Title Normalization in Source-of-Truth CSV
- **Decision**: Update `title` for `sun-life-itsm-intern-1` and `sun-life-itsm-intern-2` from `IT Service Management Intern (Academic Internship)` to `IT Service Management Intern`.
- **Rationale**: The rendering components (`components/sections/professional-experience.tsx` and `components/experience/entry.tsx`) already render `experience.badgeLabel` alongside `experience.title`. Including `(Academic Internship)` in the title created visual redundancy and cluttered mobile card headers.
- **Alternatives Considered**: Modifying the UI component to strip parentheses with regex. Rejected because clean data in the source-of-truth CSV is more maintainable and predictable.

### 2. Precise Technical Vocabulary Alignment
- **Decision**: Carefully weave all 18 mandatory technical domains into Dayforce's `description`, `responsibilities`, and `skills` columns.
- **Rationale**: Preserves exact terminology required for ATS and technical visitors while reflecting hands-on IT operations, systems administration, and cross-functional infrastructure team escalation.

### 3. Pipeline & Automation Highlighting for Sun Life
- **Decision**: Articulate Sun Life 2024 around automated batch pipelines, Excel VBA data validation, IP address validation, and SLA monitoring dashboards. Articulate Sun Life 2025 around server monitoring, telemetry analysis, incident triage/escalation, and Power Apps / Power Automate workflows.
- **Rationale**: Accurately reflects real operational contributions while providing clear proof of IT governance, systems reliability, and service management rigor.

## Risks / Trade-offs

- **[Risk] CSV Arity or Quote Delimitation Errors** → **Mitigation**: Verified pipe delimiters (`|`) for lists, escaped commas within quotes (`"..."`), and validated via `node --test lib/content/*.test.ts` (207 passing tests).
- **[Risk] Content Drift between Summary and Bullets** → **Mitigation**: Aligned both the high-level `description` narrative and the itemized `responsibilities` bullets.
