import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Presentational button.
 *
 * Deliberately accepts no `className` override: a primitive's appearance is
 * determined entirely by its own variant and size, which is what keeps a
 * button identical everywhere it is used. See design decision D9.
 *
 * Colours, spacing, and radii come from the token layer only — no raw literals.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm font-mono uppercase tracking-[0.06em] whitespace-nowrap transition-colors disabled:cursor-not-allowed';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary:
    'bg-transparent text-text border border-border-strong hover:bg-surface-raised',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-raised hover:text-text',
  danger:
    'bg-transparent text-destructive border border-destructive hover:bg-surface-raised',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-label',
  md: 'h-10 px-4 text-small',
};

/**
 * Disabled is conveyed by more than reduced opacity: the `disabled` attribute
 * removes it from the tab order and the activation path, and the label is
 * struck through so the state does not rely on colour or contrast alone.
 */
const DISABLED = 'line-through opacity-60';

/**
 * The class list for a variant and size.
 *
 * Exported so that an element which cannot be a `Button` — a `<summary>`, an
 * anchor that opens a new browsing context — can still be built from the one
 * recipe instead of re-spelling it. That is the whole point: a second copy of
 * this string is a second place for the primitive to drift from.
 */
export function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  disabled = false,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], disabled && DISABLED);
}

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Supplying an href renders an anchor instead of a button. */
  href?: string;
  /**
   * Supplying an href that leaves this site. Renders a plain anchor rather than a
   * `next/link`, opens it in a new browsing context, and marks it as doing so.
   *
   * A presentational concern, not a content one: it decides how the link behaves
   * and how that behaviour is announced. It does not decide *whether* a
   * destination leaves the site — that is a declared fact about the record, and a
   * consumer guessing it from the address would eventually guess wrong.
   */
  external?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  href,
  external = false,
  children,
}: ButtonProps) {
  const className = buttonClasses(variant, size, disabled);

  if (href !== undefined && external) {
    // A plain anchor, not `next/link`: the destination is on another site, so
    // there is no route on this one to prefetch, and the new-tab behaviour has to
    // be declared rather than inferred.
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled || undefined}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (href !== undefined) {
    return (
      <Link href={href} className={className} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={className} disabled={disabled}>
      {children}
    </button>
  );
}
