## Why

The themed boot animation overlay (`GLADWIN.DEV // BOOT`) was previously configured to persist a completion flag to `localStorage` (`gladwin_dev_boot_completed`), permanently suppressing the animation after the first visit. The desired behavior is for the themed boot sequence to always appear upon opening/loading the page, while continuing to respect `prefers-reduced-motion` and providing an immediate "SKIP SEQUENCE" action.

## What Changes

- Update `components/boot-sequence.tsx` to remove the persistent `localStorage` suppression so that the boot animation opens on every page load/refresh.
- Keep the `SKIP SEQUENCE` button functional for instant dismissal of the current sequence.
- Keep the check for `prefers-reduced-motion` intact so users requesting reduced motion bypass the animation.
- Update `openspec/specs/boot-sequence/spec.md` to reflect that the boot sequence opens on page load rather than being permanently suppressed by `localStorage`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `boot-sequence`: Updates requirement from first-time-only with permanent returning-user suppression to always displaying on page load (unless reduced motion is preferred), with an explicit skip option.

## Non-goals

- Altering the visual design, steps, or messaging of the boot sequence overlay.
- Removing or altering the `SKIP SEQUENCE` interactive button.
- Overriding user accessibility settings (`prefers-reduced-motion`).

## Impact

- `components/boot-sequence.tsx`: Client component initialization logic.
- `openspec/specs/boot-sequence/spec.md`: Capability specification.
