## 1. System Status Indicator

- [x] 1.1 Create `SystemStatus` Client Component in `components/shell/system-status.tsx`.
- [x] 1.2 Implement the pulsing dot using `--color-success` (`oklch(0.779 0.165 157)`).
- [x] 1.3 Add an expandable popover panel structure triggered by interacting with the status indicator.
- [x] 1.4 Import `CONTENT` from `lib/content/model.ts` and derive genuine metrics (e.g., total case studies, experiences, certifications) to display inside the panel.
- [x] 1.5 Update `PageShell` in `app/layout.tsx` (or `components/shell/page-shell.tsx`) to integrate the `SystemStatus` component into the header alongside primary navigation.

## 2. Boot Sequence

- [x] 2.1 Create `BootSequence` Client Component in `components/boot-sequence.tsx`.
- [x] 2.2 Implement a `useEffect` hook to read from and write to `localStorage` (`gladwin_dev_boot_completed`) to conditionally render the boot sequence.
- [x] 2.3 Implement the lightweight terminal-style initialization animation honoring `prefers-reduced-motion` using Tailwind CSS and React state.
- [x] 2.4 Include a prominent "Skip" or "Bypass" action that instantly closes the overlay and writes the completion flag.
- [x] 2.5 Integrate `BootSequence` at the root of `app/layout.tsx` so it renders over the main application when triggered.

## 3. Verification

- [x] 3.1 Run `npm run lint` and `npm run build` to verify the project compiles and checks pass with no errors.
