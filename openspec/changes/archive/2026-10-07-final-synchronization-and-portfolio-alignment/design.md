## Context

See `proposal.md` for motivation. This change reconciles the authoritative content sources (`content/certifications.csv`, `content/experiences.csv`, `content/social-links.csv`) with the architecture and presentation specifications across the entire project.

## Goals / Non-Goals

**Goals:**
- Formally document and archive the additions of Computer Systems Servicing NC2 and IBM Full Stack Software Developer Professional Certificate.
- Formally document and archive the refined completion dates for Dayforce, CyberPH, DEVCON Manila, GDSC Mobile Developer, and KakaComputer Field Ambassador roles.
- Ensure the project reaches a synchronized, immutable state where Implementation = Documentation = Specification.

**Non-Goals:**
- Introducing new unverified content or modifying existing verified certificates.
- Adding third-party styling libraries or runtime dependencies.

## Decisions

### Decision: Direct vs Profile Credential Verification Paths
- **Choice**: IBM Full Stack Software Developer Professional Certificate is classified with `verificationKind: direct` (pointing directly to `https://coursera.org/verify/professional-cert/RC5G9SM7HRG2`), while Computer Systems Servicing NC2 is classified with `verificationKind: profile` (linking to the verified LinkedIn repository).
- **Rationale**: Accurately reflects how a visiting engineer or employer verifies the credential while preserving the dual-button "LinkedIn" + "Check Verification" interaction model.

### Decision: Single-Column Centering Standard
- **Choice**: All single-column mobile layouts across terminal, cards, and sections enforce horizontal centering (`mx-auto` on max-width containers) to avoid off-center visual bias on phone screens.
- **Rationale**: Aligns mobile viewport aesthetics with the project's responsive guidelines.

## Risks / Trade-offs

- **[Risk]**: Drift between CSV sources and static routes.
  - **Mitigation**: Validated via automated test suite (`lib/content/*.test.ts`) and static export prerendering all 26 routes.
