import { cn } from '@/lib/cn';

/**
 * Presentational status indicator.
 *
 * State is conveyed by three redundant channels — silhouette, text label, and
 * colour — so it survives greyscale rendering and colour-vision differences.
 * Colour is reinforcement only. This matters most for `accent` and `warning`,
 * which sit just 18 degrees apart in OKLCH hue and would otherwise be the
 * hardest pair on the page to tell apart.
 *
 * The shape is `aria-hidden` so assistive technology announces the label
 * exactly once.
 */

export type StatusTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info';

const TONE_COLOR: Record<StatusTone, string> = {
  neutral: 'text-text-muted',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
};

/**
 * One distinct silhouette per tone: ring, disc, square, triangle, diamond,
 * bar. Six shapes that are separable without colour.
 */
function ToneShape({ tone }: { tone: StatusTone }) {
  const common = { viewBox: '0 0 16 16', width: 10, height: 10 } as const;

  switch (tone) {
    case 'neutral':
      return (
        <svg {...common} aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'accent':
      return (
        <svg {...common} aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="6" fill="currentColor" />
        </svg>
      );
    case 'success':
      return (
        <svg {...common} aria-hidden="true" focusable="false">
          <rect x="2" y="2" width="12" height="12" fill="currentColor" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common} aria-hidden="true" focusable="false">
          <path d="M8 1.5 L15 14 L1 14 Z" fill="currentColor" />
        </svg>
      );
    case 'destructive':
      return (
        <svg {...common} aria-hidden="true" focusable="false">
          <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="currentColor" />
        </svg>
      );
    case 'info':
      return (
        <svg {...common} aria-hidden="true" focusable="false">
          <rect x="1" y="6" width="14" height="4" fill="currentColor" />
        </svg>
      );
  }
}

export interface StatusIndicatorProps {
  tone: StatusTone;
  /** Required: tone is never the only channel carrying the state. */
  label: string;
}

export function StatusIndicator({ tone, label }: StatusIndicatorProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', TONE_COLOR[tone])}>
      <ToneShape tone={tone} />
      <span className="font-mono text-label uppercase tracking-[0.06em]">{label}</span>
    </span>
  );
}
