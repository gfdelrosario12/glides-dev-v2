## 1. Expertise Summary Component Refactor

- [x] 1.1 In `components/sections/expertise.tsx`, update domain models to include traceable evidence metrics (`projectsCount`, `certsCount`, `rolesCount`, `deployedCount`, `platforms`, etc.).
- [x] 1.2 Replace arbitrary proficiency labels with "EXPERIENCE INDEX", "HIGH EXPOSURE", and "DOCUMENTED EXPERIENCE".
- [x] 1.3 Add an accessible, interactive Methodology disclosure (`[ ⓘ Methodology ]`) explaining the formula and data sources.
- [x] 1.4 Update circular language gauges with documented evidence counters.

## 2. Verification

- [x] 2.1 Run `node --test lib/content/*.test.ts` to ensure content schema validation passes.
- [x] 2.2 Run `npm run lint` and `npm run build` to verify clean compilation.
