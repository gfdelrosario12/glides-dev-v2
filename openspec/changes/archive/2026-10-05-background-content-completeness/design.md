## Context
See proposal.md - Why. The system needs to distinguish between optional fields (where absence is a valid state) and authorable fields (where absence means missing content). We need to report these gaps through the existing terminal surface and update the background timeline to properly present all declared experience tracks.

## Goals / Non-Goals
**Goals:**
- Add a declared schema for authorable content gaps in `lib/content/schema.ts`.
- Derive and expose missing content via a new `gaps` terminal command.
- Properly group and count unclassified experiences in the `/background` route.
- Classify the 8 unclassified experiences in `content/experiences.csv`.

**Non-Goals:**
- We will not write missing content for `lessonsLearned`, `systems`, or `caseStudies`.
- We will not treat optional fields (like `endDate` or `degree`) as gaps.
- We will not add new UI routes or navigation items for gap reporting.

## Decisions

### 1. Schema Declaration of Authorable Content
**Decision**: Introduce `AUTHORABLE_CONTENT` in `lib/content/schema.ts`.
**Rationale**: Hardcoding which fields are "authorable" in the command logic would scatter the domain knowledge. The schema is the source of truth for the model.
**Alternatives**: Inferring from field types or requiring explicit annotations on each CSV row. Declaring at the schema level is cleaner and centralizes the rule.

### 2. Deriving Gaps in the Model
**Decision**: The content model (`lib/content/model.ts`) will evaluate records against `AUTHORABLE_CONTENT` and export a function/property (e.g., `getGaps()`) to report them. It will also check draft status of case studies to accurately report the `caseStudies` block.
**Rationale**: Keeping derivation in the model ensures that any future consumer gets the exact same view of content gaps, without recalculating it themselves.

### 3. Server-Resolved Terminal Command
**Decision**: Implement the `gaps` command in `lib/terminal/commands.ts` and declare it in `lib/terminal/registry.ts`. The command action runs on the server and returns the text output to the client.
**Rationale**: This keeps the content model and unwritten records out of the client bundle, matching the terminal spec's requirement for server-resolved commands.

### 4. Background Timeline Grouping
**Decision**: In `app/background/page.tsx`, we will ensure all 5 kinds (professional, technical, leadership, community, event-operations) are presented. We will use the model's gap derivation or total record count to compute the unclassified remainder and present it in the introduction.

## Risks / Trade-offs
- **Risk**: Adding computation to the model might slow down the build.
  **Mitigation**: The dataset is small (dozens of records), so iterating over it to find gaps is trivial.
- **Risk**: Unpublishable case studies blocking `caseStudies` might become stale logic.
  **Mitigation**: The `gaps` command logic explicitly checks case study status, keeping the reporting dynamic and accurate to current draft states.
