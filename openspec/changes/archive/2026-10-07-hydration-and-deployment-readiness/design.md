# Design Decisions: Hydration Resolution and Production Readiness

## Architectural Strategy

### 1. Polymorphic Card Description (`as="p" | "div"`)
In the standard design-system card primitive (`components/ui/card.tsx`), `CardDescription` previously hard-coded a paragraph (`<p>`) tag. When callers composed multi-row or block-level descriptions—such as `CredentialCard` in `components/credentials/card.tsx`, which renders formatted rows and monospace credential IDs inside `<div>` elements—the browser HTML parser terminated the `<p>` early and nested `<p>` around `<div>`, causing React 19 hydration failure:
`In HTML, <div> cannot be a descendant of <p>. This will cause a hydration error.`

**Decision**: Expose `as?: 'p' | 'div'` on `CardDescription`, defaulting to `'p'` to retain semantic paragraph markup for simple strings, while allowing composite layouts (e.g., `CredentialCard`) to explicitly specify `as="div"`. All typographical classes (`wrap-anywhere text-small text-text-secondary`) are preserved identically.

### 2. External Store Synchronization for Theme State
`ThemeToggle` previously attempted to detect the client theme during initial state initialization via `typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light'`. Because `document` is undefined on the server, the server rendered `theme="dark"` (button label "Light"). When the inline `<head>` script set `dataset.theme = 'light'` on page load, the client initial render evaluated to `theme="light"` (button label "Dark"), triggering:
`Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.`

Furthermore, attempting to synchronize this state via `useEffect` with `setState` was flagged by React 19's strict `react-hooks/set-state-in-effect` lint rule.

**Decision**: Use React's `useSyncExternalStore` hook:
- `getServerSnapshot()` returns `'dark'`, guaranteeing the server HTML and client initial hydration markup are 100% identical.
- `getThemeSnapshot()` reads `localStorage` and `document.documentElement.dataset.theme`.
- `subscribeTheme()` registers storage event listeners and local dispatch callbacks.
React automatically reconciles the client state post-hydration without warnings, cascading renders, or tree regeneration.

### 3. Hydration-Safe Reduced Motion via `useIsMounted`
Framer Motion's `useReducedMotion()` returns `false` during SSR (no media query environment) but can return `true` on the client if the user requested reduced motion, causing initial inline style discrepancies.

**Decision**: Implement `useIsMounted` using `useSyncExternalStore(emptySubscribe, () => true, () => false)` to ensure `reduceMotion` is `false` during SSR and initial hydration, switching to the active media query value only after mount.
