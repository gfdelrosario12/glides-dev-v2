import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata, MetadataList } from '@/components/ui/metadata';
import { StatusIndicator, type StatusTone } from '@/components/ui/status-indicator';
import { SECTION_RHYTHM } from '@/lib/layout';

/**
 * Design-system reference.
 *
 * Reachable by direct URL only — it is deliberately absent from
 * `lib/navigation.ts`, so it never appears in the header or footer.
 *
 * The values below are read out of `app/globals.css` at build time rather than
 * restated here. That is deliberate: the design-tokens spec requires exactly
 * one file to define token values, and a copied table here would be a second
 * source that could silently drift. Reading the stylesheet means this page
 * cannot disagree with the tokens it documents.
 *
 * Contrast ratios are computed from the same hex values at render time, so the
 * pass/fail badges below are measurements, not claims.
 */

export const metadata = { title: 'Design tokens' };

/* ------------------------------------------------------------------ *
 * Token extraction
 * ------------------------------------------------------------------ */

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

function extractColors(): { name: string; hex: string }[] {
  const out: { name: string; hex: string }[] = [];
  const re = /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) out.push({ name: m[1], hex: m[2] });
  return out;
}

function extractPx(name: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`--${name}-([a-z0-9]+):\\s*(\\d+)px`, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) out.push(m[2]);
  return out;
}

function extractSpacing(): string {
  return /--spacing:\s*([\d.]+rem)/.exec(css)?.[1] ?? 'unset';
}

function extractTypeScale() {
  const out: { step: string; size: string; lineHeight: string; tracking: string }[] = [];
  const re =
    /--text-([a-z]+):\s*([\d.]+rem);\s*\n\s*--text-\1--line-height:\s*([\d.]+);\s*\n\s*--text-\1--letter-spacing:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    out.push({ step: m[1], size: m[2], lineHeight: m[3], tracking: m[4].trim() });
  }
  return out;
}

const COLORS = extractColors();
const RADII = extractPx('radius');
const SPACING = extractSpacing();
const TYPE_SCALE = extractTypeScale();

/**
 * Resolve a token by name from the parsed stylesheet.
 *
 * Throws rather than falling back to a default colour: a silently substituted
 * value would let this page render a swatch that disagrees with the token layer
 * it is supposed to be documenting.
 */
function colorOf(name: string): string {
  const found = COLORS.find((c) => c.name === name);
  if (!found) {
    throw new Error(
      `Token --color-${name} was requested by /design-tokens but is not declared in app/globals.css.`,
    );
  }
  return found.hex;
}

const SURFACES = ['surface', 'surface-raised', 'surface-inset', 'surface-overlay'];

/* ------------------------------------------------------------------ *
 * Colour maths — used only to report measured contrast
 * ------------------------------------------------------------------ */

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    srgbToLinear(v / 255),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

function toOklch(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = srgbToLinear(((n >> 16) & 255) / 255);
  const g = srgbToLinear(((n >> 8) & 255) / 255);
  const b = srgbToLinear((n & 255) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

const TOKEN_GROUPS: { title: string; note: string; names: string[] }[] = [
  {
    title: 'Surfaces',
    note: 'Four elevation steps. No pure black, no pure white, no drop shadows.',
    names: SURFACES,
  },
  {
    title: 'Text',
    note: 'Every role must clear 4.5:1 on all four surfaces. Badges below are measured.',
    names: ['text', 'text-secondary', 'text-muted'],
  },
  {
    title: 'Accent',
    note: 'Amber, and the only accent family. Reserved for actionable, active, focused, or live content.',
    names: ['accent', 'accent-hover', 'accent-subtle', 'on-accent'],
  },
  {
    title: 'Status',
    note: 'warning (hue 93) sits close to accent (hue 75). Tone is never the sole channel.',
    names: ['success', 'warning', 'destructive', 'info'],
  },
  {
    title: 'Borders',
    note: 'All hairlines at 1px. border is decorative; border-strong carries the 3:1 guarantee.',
    names: ['border', 'border-strong'],
  },
];

const ALL_TONES: StatusTone[] = [
  'neutral',
  'accent',
  'success',
  'warning',
  'destructive',
  'info',
];
const ALL_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const ALL_SIZES: ButtonSize[] = ['sm', 'md'];

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title font-medium text-text">{title}</h2>
      {note ? <p className="max-w-2xl text-small text-text-secondary">{note}</p> : null}
      {children}
    </section>
  );
}

export default function DesignTokensPage() {
  return (
    <div className={`py-12 ${SECTION_RHYTHM}`}>
      <section className="flex flex-col gap-3">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
          System reference
        </p>
        <h1 className="text-display font-medium text-text">Design tokens</h1>
        <p className="max-w-2xl text-body text-text-secondary">
          Every value on this page is read from the token layer at build time and
          every contrast ratio is computed from it, so this page cannot disagree
          with the tokens it documents. Not linked from navigation.
        </p>
      </section>

      {TOKEN_GROUPS.map((group) => (
        <Section key={group.title} title={group.title} note={group.note}>
          <ul className="flex flex-col gap-2">
            {group.names.map((name) => {
              const hex = colorOf(name);
              const isTextual = group.title === 'Text' || group.title === 'Status' || name === 'accent';
              const ratios = SURFACES.map((s) => ({
                surface: s,
                ratio: contrast(hex, colorOf(s)),
              }));
              const min = Math.min(...ratios.map((r) => r.ratio));
              const passes = isTextual ? min >= 4.5 : true;

              return (
                <li
                  key={name}
                  className="grid gap-3 rounded-sm border border-border bg-surface-raised p-3 lg:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-8 w-8 shrink-0 rounded-xs border border-border"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="font-mono text-small text-text">{name}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-mono text-code text-text-secondary">
                      {hex} &middot; {toOklch(hex)}
                    </p>
                    {isTextual ? (
                      <p className="font-mono text-code text-text-muted">
                        {ratios
                          .map(
                            (r) =>
                              `${r.surface} ${r.ratio.toFixed(2)}${r.ratio >= 4.5 ? '' : '!'}`,
                          )
                          .join('  |  ')}
                        {passes ? '' : '  FAILS AA'}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      ))}

      <Section
        title="Radii and spacing"
        note={`Spacing base is ${SPACING}. Radii stop at 6px, so a pill shape is not a token.`}
      >
        <div className="flex flex-col gap-4">
          <ul className="flex flex-wrap items-end gap-6">
            {RADII.map((px, i) => (
              <li key={px} className="flex flex-col items-start gap-2">
                <span
                  aria-hidden="true"
                  className="block h-12 w-20 border border-border-strong bg-surface-inset"
                  style={{ borderRadius: `${px}px` }}
                />
                <span className="font-mono text-code text-text-secondary">
                  radius-{i} &middot; {px}px
                </span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap items-end gap-4">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
              <li key={n} className="flex flex-col items-start gap-2">
                <span
                  aria-hidden="true"
                  className="block bg-accent-subtle"
                  style={{ width: `${n * 4}px`, height: '1rem' }}
                />
                <span className="font-mono text-code text-text-secondary">
                  {n} &middot; {n * 4}px
                </span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-4">
            {['border', 'border-strong'].map((name) => (
              <li key={name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-6 w-16 rounded-xs"
                  style={{ border: `1px solid ${colorOf(name)}` }}
                />
                <span className="font-mono text-code text-text-secondary">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        title="Type scale"
        note="Prose renders in IBM Plex Sans; every machine-facing string renders in IBM Plex Mono."
      >
        <ul className="flex flex-col gap-3">
          {TYPE_SCALE.map((t) => (
            <li
              key={t.step}
              className="flex flex-col gap-1 rounded-sm border border-border bg-surface-raised p-3"
            >
              <span className="font-mono text-code text-text-muted">
                {t.step} &middot; {t.size} / {t.lineHeight} / {t.tracking}
              </span>
              <span className="text-text" style={{ fontSize: t.size, lineHeight: t.lineHeight }}>
                Prose rendering in the sans face
              </span>
              <span
                className="font-mono text-text-secondary"
                style={{ fontSize: t.size, lineHeight: t.lineHeight, letterSpacing: t.tracking }}
              >
                machine_facing --data {t.step}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Buttons"
        note="Every variant against every size. The one-primary-per-view rule applies to content views; this reference surface enumerates the full matrix by design."
      >
        <div className="flex flex-col gap-3">
          {ALL_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 font-mono text-code text-text-muted">{variant}</span>
              {ALL_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size} disabled={size === 'md' && variant === 'danger'}>
                  {size}
                </Button>
              ))}
              <Button variant={variant} disabled>
                disabled
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Card" note="The full composition, with and without the footer part.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card labelledBy="ref-card-full">
            <CardHeader>
              <CardTitle id="ref-card-full">Full composition</CardTitle>
              <CardDescription>
                Header, description, content, and footer. The card is a flat plane:
                raised surface plus a 1px hairline, never a shadow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusIndicator tone="accent" label="Active" />
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">
                Secondary
              </Button>
              <Button variant="ghost" size="sm">
                Ghost
              </Button>
            </CardFooter>
          </Card>

          <Card labelledBy="ref-card-partial">
            <CardHeader>
              <CardTitle id="ref-card-partial">Optional parts omitted</CardTitle>
              <CardDescription>
                With the footer omitted the remaining parts keep their order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusIndicator tone="destructive" label="Revoked" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Metadata"
        note="Label and value are both machine-facing, so both render in the mono face. A null value renders a placeholder rather than collapsing the row."
      >
        <MetadataList label="Reference record">
          <Metadata label="Identifier" value="token-reference-0001" />
          <Metadata
            label="Endpoint"
            value="https://placeholder.invalid/api/v1/tokens/reference/values.json"
          />
          <Metadata label="Owner" value={null} />
        </MetadataList>
      </Section>

      <Section
        title="Status tones"
        note="Six distinct silhouettes. Each tone is separable in greyscale, which is what keeps accent and warning apart despite being close in hue."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_TONES.map((tone) => (
            <li
              key={tone}
              className="flex items-center rounded-sm border border-border bg-surface-raised px-3 py-2"
            >
              <StatusIndicator tone={tone} label={tone} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}