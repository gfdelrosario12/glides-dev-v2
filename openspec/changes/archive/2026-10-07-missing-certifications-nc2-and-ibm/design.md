# Design Decisions: Missing Certifications Integration

## Architectural Decisions

### 1. Unified Source of Truth (`content/certifications.csv`)
Rather than creating special cases in UI components or hardcoding certification cards, all certifications are declared in `content/certifications.csv`. Both `FocusAreas` (`components/sections/focus-areas.tsx`) on the home page and `CredentialsPage` (`app/credentials/page.tsx`) ingest data through `credentials()` from `lib/content/model.ts`.

### 2. Strict Recency Sorting and Deterministic Presentation
The `credentials()` getter sorts records using `compareDates(b.acquiredOn, a.acquiredOn) || a.issuer.localeCompare(b.issuer) || a.title.localeCompare(b.title)`. To ensure deterministic output and maintain consistency across filesystem inspections, CSV exports, and static route generation, records in `content/certifications.csv` are sorted by `acquiredOn` descending:
1. WinOps Certified Engineer (WNO-101) (2026-09)
2. Microsoft Certified: Azure Fundamentals (2026-09)
3. Certified Cybersecurity Professional (CCP) (2026-08)
4. Google Cybersecurity Professional Certificate (2025-07)
5. Web Development NCIII (2025-07)
6. Technical Support Fundamentals (2025-01)
7. Microsoft Azure Fundamentals Skill Track (2024-11)
8. Associate Cloud Engineer (2024-10)
9. AWS Cloud Quest: Cloud Practitioner (2024-09)
10. Oracle Cloud Infrastructure 2024 Generative AI Certified Professional (2024-07)
11. Computer Systems Servicing NC2 (2024-04)
12. IBM Full Stack Software Developer Professional Certificate (2024-02)

### 3. Expiration Derivation and Verification Logic
- **Computer Systems Servicing NC2**:
  - `acquiredOn: 2024-04`
  - `expiration: 2029-04`
  - `credentialId: 24130602021244`
  - `stateLabelFor()` derives `"Expires April 2029"` naturally from the data model, requiring no hardcoded strings.
  - Linked directly to the user's LinkedIn certifications section with fallback verification.
- **IBM Full Stack Software Developer Professional Certificate**:
  - `acquiredOn: 2024-02`
  - `credentialId: RC5G9SM7HRG2`
  - `verificationUrl: https://coursera.org/verify/professional-cert/RC5G9SM7HRG2`
  - Uses `verificationKind: direct` with dual button layout: direct Coursera verification and profile reference.
