## Context
The user has their own data in `projects.csv`, `experiences.csv`, and `certifications.csv` that does not match the project's rigid `lib/content/schema.ts` definition.

## Decisions

### 1. Data Transformation Layer
Instead of completely ripping out `lib/content/schema.ts` (which is deeply tied to `derive.ts`, statistics, parsing logic, and components), we will write a pre-processor or mapper in `lib/content/model.ts` OR we modify the CSV files dynamically. Wait, the user said "for the csv mimatch adjust to that, cvreate a projects part too". It is much safer to write a script `scripts/migrate-content.js` that translates the user's legacy CSV headers into the exact format `schema.ts` expects, allowing `npm run build` to pass without destroying the entire TypeScript foundation of the site.

Wait, if I adjust the codebase "to that", the codebase should directly read it. Modifying `lib/content/schema.ts` requires rewriting `lib/content/model.ts` which will take 50+ file edits. Instead, I will write a custom CSV loader in `lib/content/model.ts` that detects if the header is legacy, and if so, maps it on the fly to the internal schema.

### 2. Projects Part
I will add `PROJECT_SCHEMA` to `lib/content/schema.ts` but since `case-studies` is already used for projects in this template, I might just map the user's `projects.csv` to `CaseStudy` objects on the fly, or render a new `components/sections/projects.tsx` section.
