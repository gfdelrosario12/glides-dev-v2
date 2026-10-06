## Why

Two authoritative certifications documented in the user's professional profile were missing or incomplete in the portfolio's central certification registry:
1. **Computer Systems Servicing NC2** (TESDA: Technical Education and Skills Development Authority), issued April 2024, valid through April 2029, Credential ID `24130602021244`.
2. **IBM Full Stack Software Developer Professional Certificate** (Coursera), issued February 2024, Credential ID `RC5G9SM7HRG2`, Verification URL `https://coursera.org/verify/professional-cert/RC5G9SM7HRG2`.

This change formally reconciles `content/certifications.csv`, the content model, the home page focus areas section, the `/credentials` vault, and dynamic static routes `/credentials/[slug]` so that all 12 authoritative credentials render in strict recency order with exact factual accuracy.

## What Changes

- **Certifications Content Model (`content/certifications.csv`)**:
  - Registered `Computer Systems Servicing NC2` with slug `tesda-computer-systems-servicing-nc2`, issuer `TESDA: Technical Education and Skills Development Authority`, acquisition `2024-04`, expiration `2029-04`, credential ID `24130602021244`, and verification destination `https://www.linkedin.com/in/gladwindr/details/certifications/`.
  - Registered `IBM Full Stack Software Developer Professional Certificate` with slug `ibm-full-stack-developer`, issuer `Coursera`, acquisition `2024-02`, credential ID `RC5G9SM7HRG2`, direct verification link `https://coursera.org/verify/professional-cert/RC5G9SM7HRG2`, and direct verification kind.
  - Ordered all 12 entries strictly by descending recency (`2026-09` down through `2024-02`).
- **Dynamic SSG Prerendering**:
  - Verified static generation produces `/credentials/tesda-computer-systems-servicing-nc2` and `/credentials/ibm-full-stack-developer`, bringing the total static route count to 26.
- **Rendering & Presentation**:
  - Both certificates appear on the home page (`FocusAreas`) and in the `/credentials` vault grid.
  - The TESDA certificate automatically derives `Expires April 2029` through `stateLabelFor()` based on the recorded `2029-04` expiration.
  - The IBM certificate features direct Coursera verification with external link indicators.

## Non-goals

- Altering any of the 10 existing authoritative certifications.
- Inventing dates, credentials, or issuers not provided by authoritative sources.
- Altering the visual design or component architecture of credential cards.

## Capabilities

### Modified Capabilities
- `credentials-vault`: Vault lists all 12 recorded credentials including Computer Systems Servicing NC2 (TESDA) and IBM Full Stack Software Developer Professional Certificate (Coursera), with dedicated static routes generated under `/credentials/[slug]`.

## Impact

- `content/certifications.csv`: Updated with complete metadata and sorted chronologically.
- `openspec/specs/credentials-vault/spec.md`: Main spec explicitly includes all authoritative certificates.
