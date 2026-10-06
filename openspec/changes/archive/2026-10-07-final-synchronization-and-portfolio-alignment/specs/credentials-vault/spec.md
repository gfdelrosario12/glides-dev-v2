## MODIFIED Requirements

### Requirement: The vault lists every recorded credential
The system SHALL provide a `/credentials` route that presents every credential in the content model, in a single declared order, and SHALL add exactly one entry for that route to the shared navigation definition. The repository SHALL include all authoritative certificates, including Computer Systems Servicing NC2 (TESDA) and IBM Full Stack Software Developer Professional Certificate (Coursera), with dedicated static routes generated under `/credentials/[slug]`. Individual credential pages SHALL NOT appear in the primary navigation.

#### Scenario: Every recorded credential is listed
- **WHEN** the `/credentials` route is rendered
- **THEN** every credential in the content model appears exactly once, in the declared order

#### Scenario: Navigation names the vault once
- **WHEN** the shared navigation definition is inspected
- **THEN** it contains one entry whose destination is the vault, and no entry whose destination is a credential address

#### Scenario: Adding a credential adds no navigation item
- **WHEN** an additional credential is recorded in `content/certifications.csv`
- **THEN** it appears on the listing and the navigation item count is unchanged

#### Scenario: An empty content model yields an empty page, not an error
- **WHEN** the `/credentials` route is rendered and the content model records no credential
- **THEN** the page renders, states that none are recorded, and presents no card

### Requirement: Verification state and dual verification routing
Each credential SHALL declare its verified destination and provide dual action buttons:
1. `LinkedIn` destination routing to the owner's LinkedIn credentials repository (`https://www.linkedin.com/in/gladwindr/details/certifications/`).
2. `Check Verification` destination routing to the issuing authority's verification URL (e.g. Coursera direct verification, Appkademiya verification, Credly badge URL, or LinkedIn profile fallback).
The destination URL SHALL also be rendered as text to allow visitors to inspect the issuing domain directly without clicking.

#### Scenario: Dual verification routing
- **WHEN** a credential card is rendered
- **THEN** it displays both "LinkedIn" and "Check Verification" buttons linking externally with secure attributes (`target="_blank" rel="noopener noreferrer"`)

#### Scenario: The destination leaves the site and displays raw URL
- **WHEN** a verification destination is presented
- **THEN** it opens in a new browsing context and states that it does, and its address is visible as text rather than hidden behind a link label alone
