## Context

The site needs a dedicated Connect page (see proposal.md) to serve as a hub for communication. We have `CONTENT.socialLinks` and `PROFILE` inside `lib/content/site.ts` which already provides structured data for social platforms and basic profile information.

## Goals / Non-Goals

**Goals:**
- Provide a clean Server Component for the `/connect` route.
- Implement a reusable client-side "Copy Email" button component.
- Implement the terminal-style contact interface described in the proposal, built using existing Tailwind surface and text tokens.

**Non-Goals:**
- Do not introduce a global React context for social links; import from `lib/content/model.ts` or `site.ts`.
- Do not add new NPM dependencies for clipboard handling; use standard Web APIs (`navigator.clipboard`).

## Decisions

### 1. Data Source
- **Decision**: Fetch social links from `CONTENT.socialLinks` and email from `CONTENT.socialLinks` where `platform === 'email'`.
- **Rationale**: Keeps the content model as the single source of truth without duplicating the email address.
- **Alternatives**: Hardcoding the email string on the page. Rejected because it violates the "driven by content model" requirement.

### 2. Copy Email Component
- **Decision**: Create a focused Client Component `CopyEmailButton` that wraps the copy logic using `navigator.clipboard.writeText`.
- **Rationale**: Minimal footprint. Only the button needs to be interactive (`use client`).
- **Alternatives**: Making the entire `/connect` page a Client Component. Rejected because we prefer Server Components by default for performance and SEO.

### 3. Terminal Interface Styling
- **Decision**: Use existing design tokens from `app/globals.css` (e.g., `--color-surface-elevated` falling back to `oklch(0.2 0 0)`, `--color-text` to `oklch(0.9 0 0)`, `--color-success` to `oklch(0.7 0.15 160)`) and Tailwind text roles (`text-mono`, `text-text`, `text-success`) for the playful terminal interface.
- **Rationale**: Maintains consistency with the site's existing terminal capability without introducing new tokens.

## Risks / Trade-offs

- [Risk] `navigator.clipboard` is unavailable in insecure contexts or certain browsers.
  - Mitigation: Fallback gracefully (e.g., provide a standard `mailto:` link if JS fails or copy fails).
