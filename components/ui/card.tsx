import { cn } from '@/lib/cn';

/**
 * Presentational card family.
 *
 * A card is a flat plane: `surface-raised` plus a 1px hairline, with no drop
 * shadow. Elevation in this system comes from the surface role, never from a
 * shadow — see design decision D7.
 *
 * The parts are separate components so optional parts can be omitted; callers
 * compose them in declaration order, which is what keeps the order stable when
 * a part is left out.
 */

export interface CardProps {
  className?: string;
  /**
   * Id of the element that names this card. When supplied, the card is
   * exposed as a labelled region using that element as its accessible name.
   */
  labelledBy?: string;
  children: React.ReactNode;
}

export function Card({ labelledBy, className, children }: CardProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        'flex min-w-0 flex-col rounded-md border border-border bg-surface-raised transition-colors duration-200 hover:border-border-strong hover:bg-surface-overlay',
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 p-4">{children}</div>;
}

export interface CardTitleProps {
  className?: string;
  id?: string;
  /** Heading level, so the card title nests correctly in the page outline. */
  level?: 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function CardTitle({ id, level = 3, className, children }: CardTitleProps) {
  
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={cn("text-title font-medium text-text", className)}>
      {children}
    </Tag>
  );
}

export interface CardDescriptionProps {
  className?: string;
  as?: 'p' | 'div';
  children: React.ReactNode;
}

export function CardDescription({ as: Component = 'p', className, children }: CardDescriptionProps) {
  return <Component className={cn("wrap-anywhere text-small text-text-secondary", className)}>{children}</Component>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 px-4 pb-4">{children}</div>
  );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
      {children}
    </div>
  );
}
