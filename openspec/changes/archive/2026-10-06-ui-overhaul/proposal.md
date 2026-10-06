## Why

The portfolio requires a restructured narrative flow that prioritizes immediate impact and visual engagement. The user wants to remove the standard text-heavy Biography section, move the statistics up before Education, and change the statistics to showcase tech stack expertise rather than raw content counts. Additionally, social links need to be more prominent with QR codes, the experience/certification/project items must act as gateways to detailed Markdown-based case study pages, and the overall UI needs smoother animations and transitions to feel modern and premium.

## What Changes

- Modify `app/page.tsx` to remove `<Biography />` and move `<StatisticsBand />` above `<EducationSummary />`.
- Rewrite the logic in `lib/content/derive.ts` and `components/sections/statistics.tsx` to calculate and display a list of top tech stack skills (based on frequency or declared expertise) instead of entity counts.
- Build a new `SocialsBand` component that displays the user's social links alongside generated QR codes, and add it to the page flow.
- Ensure no redundant terminal elements are in the DOM.
- Introduce dynamic routing for Markdown-based case studies (e.g. `/case-study/[slug]`) and update the UI cards for Experiences, Certifications, and Projects to link to these detailed pages while preserving their external URLs.
- Integrate UI animations (e.g., Framer Motion or Tailwind transitions) to cards, sections, and the terminal.

## Capabilities

### New Capabilities
- `markdown-case-studies`: Support for Markdown-backed detailed case study pages linked from portfolio items.
- `social-qr-codes`: Display of social links with scannable QR codes.
- `ui-animations`: Global entrance and interaction animations.

### Modified Capabilities
- `landing-layout`: Removes biography and reorders the sections.
- `tech-statistics`: Changes the statistics band from entity counts to skill expertise metrics.

## Impact
- **Routing:** New dynamic route `/case-study/[slug]/page.tsx` required.
- **UI:** Extensive layout shifts on the landing page, new dependencies for QR codes (e.g., `qrcode.react`) and animations (e.g., `framer-motion` or CSS animations).
- **Data:** Markdown file loading logic needed.
