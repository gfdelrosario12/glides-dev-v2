## Context

The portfolio features a themed boot sequence overlay simulating a terminal initialization (`GLADWIN.DEV // BOOT`). Previously, the component persisted completion in `localStorage` under `gladwin_dev_boot_completed`, preventing the animation from showing on subsequent visits. The user requires the animation to always run when opening the page.

## Goals / Non-Goals

**Goals:**
- Ensure the themed boot sequence always triggers on page open / reload.
- Maintain the ability to immediately skip the sequence via the `SKIP SEQUENCE` button.
- Maintain accessibility support for `prefers-reduced-motion`.

**Non-Goals:**
- Changing typography, colors, layout, or messages of the boot overlay.
- Changing terminal logic in the hero section or api routes.

## Decisions

### Always Run on Mount (Without `localStorage` Suppression)
- In `components/boot-sequence.tsx`, remove the check against `localStorage.getItem('gladwin_dev_boot_completed')`.
- Also remove storing `'true'` in `localStorage` on completion, so subsequent page reloads or visits will trigger the sequence again.
- Dismissal (completion or clicking `SKIP SEQUENCE`) merely sets `isVisible` to `false` for the current page session.
- Respect `prefers-reduced-motion`: if active, `isVisible` remains `false`.

## Risks / Trade-offs

- **[Risk] User annoyance on repeat visits** → **Mitigation**: The `SKIP SEQUENCE` button is prominently placed at the top-right of the overlay to allow instant dismissal in one click.
