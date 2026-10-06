import { QRCodeSVG } from 'qrcode.react';
import { CONTENT } from '@/lib/content/model';

/**
 * Platform SVG icons for supported communication & social endpoints.
 * All icons are rendered at 20x20px with currentColor.
 */
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.6a1.67 1.67 0 0 0-1.67 1.67c0 .92.75 1.67 1.67 1.67a1.67 1.67 0 0 0 1.67-1.67c0-.92-.75-1.67-1.67-1.67Z" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'discord':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'medium':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.48 2.77 1.25-.01 2.45-.72 2.99-1.85.22-.44.29-.93.29-1.42.02-4.32.01-8.64.01-12.96z" />
        </svg>
      );
    case 'devsite':
    case 'website':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H5.32v4.36h1.26c.38 0 .66-.07.84-.22.18-.16.27-.42.27-.79v-2.33c0-.37-.09-.63-.27-.79zm1.1-1.36c.45.36.68.95.68 1.77v3.08c0 .82-.23 1.41-.68 1.77-.45.36-1.12.54-2 .54H4.14V7.92h2.38c.88 0 1.55.18 2 .54v-.05zm3.87 7.23h-1.18V7.92h1.18v8zm4.49-7.23c-.45-.36-1.12-.54-2-.54h-2.38v8.92h2.38c.88 0 1.55-.18 2-.54.45-.36.68-.95.68-1.77v-3.08c0-.82-.23-1.41-.68-1.77v.05zm-.83 4.85c-.18.16-.46.22-.84.22h-1.26v-4.36h1.26c.38 0 .66.07.84.23.18.16.27.42.27.79v2.33c0 .37-.09.63-.27.79zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
        </svg>
      );
  }
}

const ENDPOINT_DESCRIPTIONS: Record<string, string> = {
  linkedin: 'Professional network & industry connections',
  github: 'Open-source code & technical repositories',
  email: 'Direct inquiries & correspondence',
  facebook: 'Community discussions & network updates',
  twitter: 'Engineering commentary & live tech dispatches',
  discord: 'Developer community discussions & real-time chat',
  instagram: 'Visual journey & developer lifestyle',
  medium: 'In-depth engineering articles & technical writing',
  youtube: 'Walkthroughs, demos & developer tutorials',
  tiktok: 'Short-form technology insights & field notes',
  devsite: 'Dev.to engineering blog & community publications',
  website: 'Dev.to engineering blog & community publications',
};

/**
 * Unified Connect & Socials Section.
 *
 * Integrates every channel's icon, name, descriptive overview, direct clickable
 * action link, and scannable QR code into a single cohesive interface. Eliminates
 * duplicate and fragmented sections across desktop and mobile.
 */
export function SocialsBand() {
  const links = CONTENT.socialLinks;

  if (links.length === 0) return null;

  return (
    <section
      id="socials"
      aria-labelledby="socials-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <h2 id="socials-heading" className="text-title font-medium text-text">
          Connect &amp; Socials
        </h2>
        <p className="max-w-prose text-small text-text-secondary">
          Browse profiles directly or scan any QR code with a secondary device for in-person networking.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => {
          const description =
            ENDPOINT_DESCRIPTIONS[link.platform] || 'Connect with Gladwin Ferdz Del Rosario';
          const isEmail = link.platform === 'email';

          return (
            <li
              key={link.platform}
              className="group flex w-full max-w-md flex-col justify-between rounded-md border border-border bg-surface-raised p-5 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay mx-auto sm:max-w-none"
            >
              <div className="flex flex-col gap-3">
                {/* Header: Platform Icon + Metadata */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-inset text-accent">
                      <PlatformIcon platform={link.platform} />
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                        {link.platform}
                      </span>
                      <h3 className="truncate text-heading font-medium text-text">
                        {link.label}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-small text-text-secondary line-clamp-2">
                  {description}
                </p>
              </div>

              {/* Action row & integrated QR code */}
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-surface px-3.5 py-2 font-mono text-label uppercase tracking-[0.06em] text-accent transition-colors hover:border-accent hover:bg-accent-subtle hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span>{isEmail ? 'Send Email' : `Open ${link.label}`}</span>
                  <span aria-hidden="true" className="text-heading leading-none">↗</span>
                  {link.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>

                <div className="flex flex-col items-center gap-1 shrink-0">
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="rounded-sm bg-white p-1.5 shadow-xs transition-transform duration-150 group-hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    aria-label={`Scan or open QR code for ${link.label}`}
                    tabIndex={-1}
                  >
                    <QRCodeSVG
                      value={link.href}
                      size={88}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="M"
                    />
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
                    Scan code
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
