# Gladwin.dev

Personal portfolio and resume site for **Gladwin Ferdz Del Rosario** — full stack
developer and cloud infrastructure engineer.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.
The runtime dependency list is the `create-next-app` default and nothing else:
no component library, no `tailwind-merge`, no icon package.

## Design system

A dark charcoal system built around one idea: **prose is sans, everything a
machine would emit is mono.** That single rule is what makes metadata, tech
stacks, and terminal content read as instrumentation rather than as prose that
happens to be small.

### Typefaces

| Face | Role |
| --- | --- |
| **IBM Plex Sans** | Prose — headings, paragraphs, navigation labels, card descriptions |
| **IBM Plex Mono** | Data — metadata, labels, tech stacks, status, dates, versions, URLs, identifiers, terminal content |

Both load through `next/font`, so they are self-hosted from this origin with
metric-matched fallbacks and no third-party request at runtime.

### Colours

Four surface roles, three text roles, one accent family (amber), and four status
hues — all defined by role, never by raw hue.

```
surface          #0b0c0e    page base
surface-raised   #131519    cards
surface-inset    #1a1d22    code, inputs
surface-overlay  #22262c    top layer

text             #e8eaed
text-secondary   #a8aeb8
text-muted       #868e9a

accent           #ffb020    actionable / active / focused / live — nothing else
accent-hover     #ffc24d
accent-subtle    #3a2a0e
on-accent        #0b0c0e

success          #3dd68c    warning  #d9b310
destructive      #f0616d    info     #58a6ff

border           #262a31    decorative hairline
border-strong    #66696e    interactive boundary
```

Every text and status role clears WCAG AA (4.5:1) on all four surfaces. The
weakest pairing is `text-muted` on `surface-overlay` at 4.60:1.

Two constraints worth knowing before you change anything:

- **Accent is reserved.** Amber marks content that is actionable, active,
  focused, or live. It is not a highlight for section headings or dividers.
- **`warning` sits close to `accent`** — OKLCH hue 93 versus 75, only 18° apart.
  That is why `StatusIndicator` renders a distinct silhouette *and* a required
  text label: tone is never the sole channel carrying a state.

### Metrics

Spacing is a 4px base (`--spacing: 0.25rem`). Radii are three steps — 2px, 4px,
6px — and nothing exceeds 6px, so a pill shape is not a token. Borders are
always 1px; emphasis changes border colour, never width. Depth comes from the
surface role, never from a drop shadow.

The system is **dark only**. There is no light theme and no
`prefers-color-scheme` branch.

## Inspecting it

Visit **`/design-tokens`** for a live reference. That page reads the token layer
at build time and computes its own contrast ratios, so it cannot drift from the
values in `app/globals.css`. It is deliberately unlinked from navigation.

## Structure

```
app/
  globals.css              token layer — the single source of truth
  layout.tsx               fonts, metadata, PageShell
  page.tsx                 placeholder composition exercising the system
  design-tokens/page.tsx   live token reference
components/
  layout/
    page-shell.tsx         skip link + header + main + footer
    site-header.tsx        sticky banner, nav, native <details> disclosure
    site-footer.tsx        colophon and build stamp
    nav-link.tsx           the only client component (usePathname)
    skip-link.tsx
  ui/
    button.tsx             primary | secondary | ghost | danger, sm | md
    card.tsx               Card + Header/Title/Description/Content/Footer
    metadata.tsx           Metadata, MetadataList
    status-indicator.tsx   neutral | accent | success | warning | destructive | info
lib/
  cn.ts                    class joiner
  navigation.ts            nav and social links — single source of truth
  layout.ts                shared gutter and section rhythm
```

## Authoring rules

These are enforced by review, not by tooling. Tailwind will happily emit
`rounded-3xl` or `text-orange-500` on request.

1. **Reference colours by role, never by literal.** `bg-surface-raised`, not
   `#131519`. If a need cannot be expressed by a role, the role set is wrong —
   add it deliberately to `app/globals.css` rather than reaching for a raw hue.
2. **Keep radii at 6px or below.** No `rounded-full`.
3. **Use the mono face for machine-facing strings** — anything with a value a
   machine would produce. Prose stays in the sans face.
4. **Compose chrome from `components/ui`.** Do not hand-roll a button, card,
   metadata row, or status dot.
5. **Primitives take no `className` override.** Their appearance comes from their
   own props. If one instance genuinely differs, that is a new variant, reviewed
   once — not a one-off override at a call site.
6. **Keep primitives presentational.** No data fetching, no parsing, no domain
   vocabulary. Resolve content before it reaches a primitive.
7. **Separate regions with `SECTION_RHYTHM`** from `lib/layout.ts` rather than
   inventing a gap.
8. **Reserve `'use client'` for genuine interactivity.** The whole app is Server
   Components except `nav-link.tsx`; the mobile disclosure uses native
   `<details>` and needs no JavaScript at all.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Licence

MIT.