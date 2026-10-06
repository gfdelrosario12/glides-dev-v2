import Link from 'next/link';

import { PROFILE } from '@/content/site';
import { CONTENT_GUTTER } from '@/lib/layout';
import { SocialsBand } from '@/components/sections/socials';

export const metadata = {
  title: 'Connect \u00b7 Social Hub',
  description:
    'Find every way to connect with Gladwin Ferdz Del Rosario across professional networks, developer channels, and direct contact.',
  alternates: { canonical: '/connect' },
  openGraph: {
    type: 'website',
    url: 'https://gladwin.dev/connect',
    title: 'Connect with Gladwin Ferdz Del Rosario \u00b7 Social Hub',
    description:
      'Direct contact, social endpoints, and engineering profiles for Gladwin Ferdz Del Rosario.',
  },
  twitter: {
    card: 'summary',
    title: 'Connect with Gladwin Ferdz Del Rosario \u00b7 Social Hub',
    description:
      'Direct contact, social endpoints, and engineering profiles for Gladwin Ferdz Del Rosario.',
  },
};

export default function ConnectPage() {
  return (
    <article className={`min-h-[70svh] pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 sm:py-12 ${CONTENT_GUTTER}`}>
      <div className="mx-auto flex max-w-wide flex-col gap-10 sm:gap-12">
        <header className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-success">
            gladwin.dev / social hub
          </p>
          <h1 className="text-display font-medium text-text">Let&apos;s connect.</h1>
          <p className="text-heading font-medium text-text">{PROFILE.name}</p>
          <p className="text-heading text-text-secondary">{PROFILE.role}</p>
          <p className="max-w-prose text-body text-text-secondary">
            Whether you&apos;re here to talk systems, projects, or what comes next, you&apos;re welcome here.
          </p>
        </header>

        {/* Unified Connect & Socials Channels with Integrated QR Codes */}
        <SocialsBand />

        <div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center self-start rounded-sm px-2 py-2 font-mono text-label uppercase tracking-[0.06em] text-text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            &lt;- full portfolio
          </Link>
        </div>
      </div>
    </article>
  );
}
