## Why

The portfolio's project case studies must demonstrate the principles of professional portfolio development: presenting projects as structured engineering articles that explain the problem, process, personal contributions, evidence-based results, and lessons learned. The current case study articles need a standardized editorial structure and first-person engineering voice addressing the six core questions: What was built, Why it was needed, How it was approached, What was personally contributed, What evidence demonstrates the outcome, and What was learned.

## What Changes

1. **Standardized 10-Part Article Template**:
   Standardize all 12 project case studies in `content/case-studies-md/` to follow the professional workshop framework:
   - **Overview**: Concise project introduction, intended users, purpose, and relevance.
   - **Problem and Context**: Real-world context, user needs, and why the problem matters.
   - **Objectives and Requirements**: Core goals, technical requirements, and constraints.
   - **Approach and Process**: Architectural choices, planning, workflow, and engineering methodology.
   - **Solution and Key Features**: Detailed examination of implemented components with technical mechanics.
   - **My Role and Contributions**: Explicit first-person ownership of architectural design, frontend/backend engineering, systems configuration, and technical decisions.
   - **Challenges and Decisions**: Concrete technical hurdles, trade-offs evaluated, rationale for choices made, and outcomes.
   - **Results and Validation**: Evidence-based outcomes (functional demonstrations, benchmarked latencies, verified requirements, deployment status) with clear distinction of prototypes/academic demonstrations.
   - **Lessons Learned and Future Improvements**: Specific skills developed, technical takeaways, current limitations, and future improvements.
   - **Closing and Project Links**: Concluding takeaway with verified public links (Repository, Live Site).

2. **Editorial UI/UX Header & Meta Enhancement**:
   - Enhance the header layout in `app/case-study/[slug]/page.tsx` to display:
     - Clear role and contribution indicator (e.g. "Full-Stack Engineer", "Lead Developer", "Firmware & IoT Engineer").
     - Project category and domain tag.
     - Direct, accessible repository and live demo action links.
     - Reading measure and visual balance.

## Capabilities

### Modified Capabilities
- `markdown-case-studies`: Codifies the standardized 10-part professional engineering case study structure, first-person contribution ownership, and evidence-based results presentation across all portfolio projects.

## Non-goals

- Fabricating clients, commercial revenue, adoption figures, or unsupported production deployments.
- Introducing decorative dashboard cards or heavy client-side animation widgets into articles.
- Modifying underlying CSV schemas or unrelated portfolio sections.

## Impact

- `content/case-studies-md/*.md`: 12 standardized, professional engineering articles.
- `app/case-study/[slug]/page.tsx`: Enhanced header metadata display and editorial presentation.
