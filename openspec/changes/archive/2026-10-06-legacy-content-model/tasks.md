## 1. Implement CSV Mapper

- [x] 1.1 In `lib/content/model.ts`, intercept the CSV parsing for `experiences.csv` and `certifications.csv`. If the first line indicates the user's legacy headers, map the rows to the required internal schema (e.g., parse `duration` to `startDate`, generate `slug` from `title`).

## 2. Add Projects Section

- [x] 2.1 Create a new schema `PROJECT_SCHEMA` in `lib/content/schema.ts` for `projects.csv`.
- [x] 2.2 Export the parsed projects in `lib/content/model.ts`.
- [x] 2.3 Create `components/sections/projects.tsx` to render the user's projects.
- [x] 2.4 Add the `Projects` section to `app/page.tsx`.

## 3. Verification

- [x] 3.1 Run `npm run lint` and `npm run build` to ensure the site compiles with the user's custom CSV format.
