## Why

The case study article pages (`/case-study/[slug]`) currently render raw Markdown directly without tailored editorial styling, visual hierarchy, typography controls, reading progress feedback, or table-of-contents navigation. A dedicated editorial layout is needed to match the visual standards of high-quality engineering case studies and portfolio sites.

## What Changes

1. **Editorial Article Layout**:
   - Establish a refined article container with balanced whitespace, line lengths constrained to optimal reading measures (~65–75 characters per line), and clear vertical section rhythm.
   - Design a professional article header presenting category, technology badges, title, subtitle/summary, and external action links (Live Site, Source Code).
2. **Typography & Content Styling**:
   - Add custom styling classes for rendered Markdown articles (`article-content`):
     - Distinct typography hierarchy: h1, h2 with subtle accent borders/accents, h3 subheadings.
     - Styled paragraphs with comfortable line heights (`leading-[1.75]`).
     - Distinct blockquotes with accent left borders and inset backgrounds.
     - Styled ordered and unordered lists with custom bullet styling.
     - Horizontal dividers with subtle hair-line borders.
     - Formatted inline code snippets and code blocks with syntax background styling and scroll wrappers.
3. **Reading Navigation & Interactivity**:
   - Add a sticky reading progress bar at the top of the viewport indicating progress through the article.
   - Include a collapsible/responsive in-page Table of Contents (TOC) derived from the article's h2 and h3 headings.
   - Add smooth back-to-projects navigation at both the header and footer of the article.
4. **Responsive Behavior**:
   - Ensure the article layout scales gracefully across mobile (320px–480px), tablet, and desktop without horizontal overflow or cramped elements.

## Capabilities

### Modified Capabilities
- `markdown-case-studies`: Extends the case study reading experience with professional editorial layout rules, in-page navigation, reading progress, and responsive typography hierarchy.

## Non-goals

- Altering the Markdown source files or changing factual project details.
- Adding heavy third-party client dependencies or complex canvas dashboards.
- Modifying the core design system tokens or color palette.

## Impact

- `app/case-study/[slug]/page.tsx`: Enhanced editorial server component parsing and rendering.
- `components/case-study/case-study-reader.tsx`: Client component providing reading progress, TOC navigation, and interactive article controls.
- `app/globals.css`: Editorial typography styling rules for `.article-content`.
