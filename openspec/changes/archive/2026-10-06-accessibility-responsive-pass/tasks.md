## 1. UI Primitives Accessibility

- [x] 1.1 Update `Button` component styles to guarantee a minimum dimension of 44x44 CSS pixels using `min-h-[44px]` and `min-w-[44px]` (or equivalent padding) on mobile breakpoints (`max-sm:min-h-[44px]`).
- [x] 1.2 Audit and update other interactive elements (e.g., links in the SiteHeader and SiteFooter, or disclosures) to ensure their touch target sizes meet the 44px minimum on mobile devices.

## 2. Terminal Enhancements

- [x] 2.1 Create a new `TerminalSuggestions` client component that provides quick-action buttons for common commands (e.g., `help`, `projects`, `clear`).
- [x] 2.2 Style the suggestions component as a horizontal scrolling list (`overflow-x-auto`) and restrict its display to mobile breakpoints (`max-sm:flex sm:hidden`).
- [x] 2.3 Integrate `TerminalSuggestions` into the main `TerminalOverlay` component so that tapping a suggestion automatically inputs and runs the command.

## 3. Media Optimization & Performance

- [x] 3.1 Audit `<img>` and `next/image` tags across case studies, experiences, and the home page.
- [x] 3.2 Ensure below-the-fold media elements carry `loading="lazy"` and `priority={false}` to prevent blocking the initial render.
- [x] 3.3 Apply `motion-safe:` utility class to continuous animations (like the operational pulse in the `SystemStatus` component) to pause them when `prefers-reduced-motion` is active.

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npm run build` to verify the project compiles and all checks pass.
