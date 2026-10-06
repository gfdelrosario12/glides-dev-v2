## 1. Terminal Component Extraction

- [x] 1.1 Extract the core terminal UI (scrollback, input, suggestions) from `TerminalOverlay` into a new `TerminalUI` component that can be rendered anywhere.
- [x] 1.2 Update `TerminalOverlay` to wrap the new `TerminalUI` component. Ensure the global `TerminalProvider` handles multiple consumers gracefully.

## 2. Hero Section Update

- [x] 2.1 Update `components/sections/hero.tsx` to include the `TerminalUI` embedded within its layout.
- [x] 2.2 Add `public/images/Main.JPG` (or `Grad.JPG`) to the `hero.tsx` section alongside the biography and terminal, styling it with responsive token classes.

## 3. Easter Eggs

- [x] 3.1 Declare `sudo` and `coffee` in `lib/terminal/registry.ts`.
- [x] 3.2 Implement resolvers for `sudo` and `coffee` in `lib/terminal/commands.ts`.

## 4. Verification

- [x] 4.1 Run `npm run lint`, `tsc --noEmit`, and `npm run build` to verify the project compiles without warnings or errors.
