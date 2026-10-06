## Context
The user wants to restructure the landing page to be more punchy (removing Biography, moving Statistics up), change the nature of Statistics to reflect tech stack expertise, add a dedicated QR-code backed Socials section, introduce Markdown-based case studies for all portfolio items, and add UI animations.

## Decisions

### 1. Layout Adjustments
`app/page.tsx` will be reorganized. `<Biography />` will be removed. `<StatisticsBand />` will be moved above `<EducationSummary />`.

### 2. Tech Expertise Statistics
The `DERIVED.statistics` object will be modified. Instead of returning `experienceCount`, `projectCount`, etc., we will calculate a `techExpertise` array in `lib/content/derive.ts` by counting the occurrences of each technology in `Project.techStack` and `Experience.tools`. We will display the top 4-5 skills in the `StatisticsBand`.

### 3. QR Code Socials
We will use the `qrcode.react` package (or simply render an SVG if possible, but an external library or API is easier). Since this is a Next.js app, installing `qrcode.react` is the cleanest approach. We will create `<SocialsBand />`.

### 4. Markdown Case Studies
We will create a new dynamic route `app/case-study/[slug]/page.tsx`.
We will use `next-mdx-remote` or `marked` to parse Markdown files stored in a new `content/case-studies-md/` directory.
The cards in `components/experiences/*`, `components/certifications/*`, and `components/sections/projects.tsx` will have their wrappers changed to `<Link href={\`/case-study/\${slug}\`}>`, while keeping the external `<a href>` for live site / source code within the card.

### 5. Animations
We will install `framer-motion` to handle scroll-triggered entrance animations (`whileInView`) for the major sections, giving the site a premium, dynamic feel without overly complex CSS.
