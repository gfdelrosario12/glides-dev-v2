/**
 * First focusable element on every page.
 *
 * Uses the `.skip-link` utility from the token layer, which is visually hidden
 * until focused. Activating it moves focus to the main region, which carries
 * `id="main-content"` and `tabIndex={-1}` in `PageShell`.
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}
