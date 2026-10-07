## 1. Content Rebranding & Title Normalization

- [x] 1.1 Update `content/experiences.csv` rows for Sun Life (`sun-life-itsm-intern-1` and `sun-life-itsm-intern-2`) to canonical title `IT Service Management Intern`.
- [x] 1.2 Refine descriptions, responsibilities, and skills for Sun Life 2024 and Sun Life 2025 to highlight automated data validation pipelines, server monitoring, infrastructure telemetry, and service management automation.
- [x] 1.3 Refine description, responsibilities, and skills for Dayforce (`dayforce-it-service-desk-intern`) to center on enterprise IT operations, systems administration, and infrastructure support while maintaining all 18 mandatory technical domains.

## 2. Validation & Verification

- [x] 2.1 Run unit test suite `node --test lib/content/*.test.ts` to confirm CSV parsing, syntax, arity, and schema validation.
- [x] 2.2 Run static code analysis `npm run lint` and verify zero errors or warnings.
- [x] 2.3 Run production build `npm run build` and verify all 26 static/dynamic routes compile and prerender cleanly.
