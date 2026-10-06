## 1. Certification Data Model & Metadata

- [x] 1.1 Update `content/certifications.csv` with `tesda-computer-systems-servicing-nc2` (Issued 2024-04, Expires 2029-04, ID 24130602021244).
- [x] 1.2 Update `content/certifications.csv` with `ibm-full-stack-developer` (Issued 2024-02, ID RC5G9SM7HRG2, direct Coursera verification URL).
- [x] 1.3 Order all 12 certification records chronologically descending by acquisition date.

## 2. Rendering, Verification & Static Generation

- [x] 2.1 Verify both certifications render in home page `FocusAreas` and `/credentials` vault.
- [x] 2.2 Verify static route generation creates `/credentials/tesda-computer-systems-servicing-nc2` and `/credentials/ibm-full-stack-developer`.
- [x] 2.3 Verify 207 content tests pass without regressions (`node --test lib/content/*.test.ts`).
- [x] 2.4 Verify clean ESLint and Next.js Turbopack production builds (`npm run lint && npm run build`).

## 3. Specification & Archive

- [x] 3.1 Update delta spec and synchronize with main `credentials-vault` specification.
- [x] 3.2 Validate and archive change via OpenSpec.
