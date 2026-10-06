## Context
See proposal.md for motivation. We need to implement a sophisticated horizontally connected infrastructure visualization for the expertise section, build a completely standalone mobile-first `/connect` route, meticulously clean up the layout and duplicated terminal components, and add comprehensive technical SEO. 

## Goals / Non-Goals
**Goals:**
- Replace numeric percentage bars with a topological "infrastructure loader" metaphor for expertise.
- Create `/connect` as a standalone route optimized for in-person sharing (NFC/QR).
- Strictly enforce window bar layout and icon constraints (accessible targets, small optical icons).
- Implement semantic HTML and metadata everywhere.

**Non-Goals:**
- Do not reinvent the data layer; rely entirely on existing `DERIVED` data models in `lib/content/`.
- Do not introduce heavy canvas/WebGL libraries; use CSS and Framer Motion.
- Do not introduce new color tokens.

## Decisions

### 1. Expertise Visualization: "Infrastructure Topology"
- **Approach:** Build `InfrastructureExpertise` in `components/sections/expertise.tsx`. Use a horizontal sliding system that feels like dependencies loading. Node connections will be drawn with CSS borders or inline SVG. We will use `framer-motion` to sequence the entrance: layout initialization -> line drawing -> node revelation -> stable state.
- **Alternatives Considered:** A traditional progress bar (rejected as generic and explicitly discouraged by the user) or a complex interactive node graph (rejected as too heavy for a simple portfolio).

### 2. Standalone Networking Endpoint
- **Approach:** The `/connect` route will not use the standard `PageShell` layout if it distracts from the mobile-first networking goal, or it will use a minimal variation. It will display a compact identity block ("whoami"), a clear context string, and high-contrast touch targets for endpoints (LinkedIn, GitHub, Email). It will use the typography and color tokens to feel like a "terminal environment" without actually rendering the `<TerminalUI />` box.
- **Alternatives Considered:** Rendering the full terminal in `/connect` (rejected by user as redundant visual noise). Using a linktree service (rejected).

### 3. Window Bar Consistency
- **Approach:** Audit `components/ui/card.tsx` and similar files if they render window controls (like macOS style traffic lights or terminal headers). We will enforce a `h-8` or `h-10` container with actual interactive hit targets (e.g., `p-2` or `w-8 h-8 flex items-center justify-center`) while the inner visual element (e.g., a dot or icon) remains `w-3 h-3`.
- **Alternatives Considered:** Leaving them as-is. (Rejected as they were visually inconsistent).

### 4. Technical SEO and Metadata
- **Approach:** Update `app/layout.tsx` and all page-level `layout.tsx` or `page.tsx` exports to include Next.js Metadata objects with Open Graph tags. Add structured data (JSON-LD) using a `<script type="application/ld+json">` tag in the root layout. Ensure all sections use proper `<article>`, `<section>`, `<h1>`-`<h3>` tags, taking care to migrate `div` heavy layouts where appropriate.
- **Alternatives Considered:** Doing it manually per file, but Next.js metadata API is more robust.

## Risks / Trade-offs
- [Risk] Framer Motion sequences can cause layout shifts if not careful. → Mitigation: Use initial opacity states and reserve space via CSS grid/flex where possible to avoid CLS (Cumulative Layout Shift).
- [Risk] SEO JSON-LD gets out of sync with content. → Mitigation: Derive the JSON-LD payload dynamically from the same `lib/content/derive.ts` outputs.
