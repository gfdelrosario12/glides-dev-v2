## Why

The portfolio's content model is currently strictly typed to a specific CSV schema (e.g., `startDate`, `endDate`, `track`), but the provided external CSV data (`experiences.csv`, `certifications.csv`, `projects.csv`) uses a simplified legacy format (e.g., `duration`, `type`, `badgeColor`). To prevent parsing errors and allow seamless data updates, the content parser must be adjusted to accept the user's CSV format. Additionally, the portfolio needs to explicitly support and render a "Projects" section using the `projects.csv` data.

## What Changes

- Update `lib/content/schema.ts` to reflect the fields actually present in the user's `experiences.csv` and `certifications.csv`.
- Create a new `PROJECT_SCHEMA` in `lib/content/schema.ts` for `projects.csv`.
- Modify `lib/content/model.ts` and the UI components (`components/experiences/*`, `components/certifications/*`) to consume the new field names (e.g., `duration` instead of `startDate`/`endDate`, `type` instead of `track`).
- Add a new "Projects" section to the UI (likely on the home page or a dedicated `/projects` route).

## Capabilities

### New Capabilities
- `projects`: Defines the content model and presentation for the new `projects.csv` data.

### Modified Capabilities
- `content-model`: Adjusts the `experiences` and `certifications` schema to match the user's legacy CSV formats.

## Impact
- **Content:** `lib/content/schema.ts`, `lib/content/model.ts`
- **UI:** Rebuilding timeline and credential components to use `duration` strings instead of parsed Date objects, and adjusting the `Projects` section.
