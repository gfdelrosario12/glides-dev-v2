## Context

This is a comprehensive audit and final integration pass to ensure strict adherence to existing specifications (`design-tokens`, `typography`, `ui-primitives`, and `content-model`).

## Goals / Non-Goals

**Goals:**
- Identify and eliminate all raw color and spacing literals that violate the `design-tokens` spec (e.g., in padding, margin, borders).
- Replace hardcoded static counts (e.g., number of case studies, number of experiences) in `SystemStatus`, Connect page, and terminal with dynamic counts derived directly from `lib/content/model.ts`.
- Ensure all pages and components match the established layouts.

**Non-Goals:**
- Introducing new features or components.
- Rewriting the content parsing logic.

## Decisions

### 1. Token Standardization
- **Decision**: Search for raw Tailwind classes (e.g., `text-gray-500`, `bg-white`, `p-5`) and replace them with defined token roles (e.g., `text-text-muted`, `bg-surface`, `p-4` or `p-6`).
- **Rationale**: `design-tokens` spec mandates that no raw values or colors should be used outside of `globals.css`. 

### 2. Content Data Integration
- **Decision**: Update terminal commands and statistic views to pull metrics (e.g., `projects.length`) directly from the parsed `CONTENT` exported in `lib/content/model.ts`. For client components like the terminal, these counts will be provided via server-side props or a unified `/api/terminal` response.
- **Rationale**: The content model is the source of truth, avoiding drift between the UI and actual content.

## Risks / Trade-offs

- [Risk] Aggressive cleanup of raw CSS classes might alter some intentional, non-standard layout choices.
  - Mitigation: Compare visual output before and after. If an explicit layout requirement is unmet by the tokens, we should review the specs, but we aim for zero divergence.
