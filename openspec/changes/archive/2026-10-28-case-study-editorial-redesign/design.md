## Context

The portfolio's case study routes (`/case-study/[slug]`) render long-form technical write-ups. While the content is rich and technically credible, the default presentation used generic unstyled Tailwind prose classes that did not exist in Tailwind v4 without the typography plugin, resulting in suboptimal readability, flat typography, and lack of reading navigation.

## Goals / Non-Goals

**Goals:**
- Implement a dedicated CSS editorial layer (`.article-content`) in `app/globals.css` using the existing design tokens (OKLCH colors, typography scale, border styles).
- Build a lightweight `CaseStudyReader` client component that provides:
  1. An animated reading progress bar pinned to the top of the viewport.
  2. An interactive in-page Table of Contents (TOC) that tracks active headings via `IntersectionObserver`.
  3. Copyable section link anchors on heading hover.
- Structure the page layout with an editorial header (Breadcrumb navigation, Category chip, Tech tags, Title, Date/Meta line, and Action Buttons).
- Maintain 100% server-side rendering for article content and SEO.

**Non-Goals:**
- Introducing heavy client dependencies (e.g. heavy syntax highlighters or heavy charting libraries).
- Rewriting the content in `content/case-studies-md/`.

## Decisions

### 1. CSS-First Editorial Typography
Instead of adding third-party plugins, define explicit CSS rules in `app/globals.css` under `.article-content`. This ensures strict adherence to `--color-text`, `--color-text-secondary`, `--color-accent`, and monospace code fonts across both dark and light modes.

### 2. Heading Anchor Extraction
In the server component, automatically parse `<h2>` and `<h3>` tags with deterministic slug IDs, so the client component can construct the TOC table without manual authoring.

### 3. Progressive Enhancement
The article is fully readable and functional even with JavaScript disabled. The reading progress and TOC enhance the experience when JavaScript is active.

## Risks / Trade-offs

- **[Risk] Heading ID collision**: Mitigate by generating kebab-case slugs from heading text with index fallbacks.
