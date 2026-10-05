/**
 * Class-name joiner.
 *
 * Deliberately not `clsx` + `tailwind-merge`. That pair exists to resolve
 * conflicts between caller-supplied class strings and a component's own base
 * classes. No primitive in this system accepts a `className` override, so
 * there are no conflicts to merge. See design decision D4.
 */

export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  let out = '';

  for (const value of values) {
    if (!value) continue;
    out = out ? `${out} ${value}` : value;
  }

  return out;
}
