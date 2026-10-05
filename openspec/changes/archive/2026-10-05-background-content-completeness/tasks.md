## 1. Data Classification

- [x] 1.1 Classify the 8 unclassified experiences in `content/experiences.csv` with their appropriate `track` value (leadership, event-operations, community) as specified in the proposal.

## 2. Schema and Model Updates

- [x] 2.1 Declare `AUTHORABLE_CONTENT` object in `lib/content/schema.ts` specifying authorable fields per collection (e.g., `lessonsLearned`, `systems`, `caseStudies` for experiences).
- [x] 2.2 Add gap derivation logic to `lib/content/model.ts` that evaluates records against `AUTHORABLE_CONTENT` and unpublishable case studies.

## 3. Terminal Integration

- [x] 3.1 Register the `gaps` command in `lib/terminal/registry.ts`.
- [x] 3.2 Implement the `gaps` command resolver in `lib/terminal/commands.ts` using the model's gap derivation, printing missing authorable content and blocked case studies.

## 4. Background Route Updates

- [x] 4.1 Update `app/background/page.tsx` introduction to read the model's derived account and explicitly state the unclassified experiences count.

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run build` to ensure the project compiles and lint rules pass.
