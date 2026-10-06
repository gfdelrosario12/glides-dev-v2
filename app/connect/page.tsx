import Link from 'next/link';

import { PROFILE } from '@/content/site';
import { CONTENT } from '@/lib/content/model';
import { CONTENT_GUTTER } from '@/lib/layout';

export const metadata = {
  title: 'Social hub',
  description:
    'Find every way to connect with Gladwin Ferdz Del Rosario through one welcoming social hub.',
  alternates: { canonical: '/connect' },
};

export default function ConnectPage() {
  const endpoints = CONTENT.socialLinks;
  const endpointDetails: Record<string, string> = {
    linkedin: 'Professional network',
    github: 'Code / projects',
    email: 'Direct contact',
    linktree: 'Everything in one place',
  };

  return (
    <article className={`min-h-[70vh] py-12 ${CONTENT_GUTTER}`}>
      <div className="mx-auto flex max-w-md flex-col gap-10">
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

        <section aria-labelledby="endpoints-heading" className="flex flex-col gap-4">
          <h2 id="endpoints-heading" className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Find me online
          </h2>
          <ul className="flex flex-col gap-3">
            {endpoints.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex min-h-20 items-center justify-between border border-border-strong bg-surface-raised px-5 py-4 transition-colors hover:border-accent hover:bg-accent-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-heading font-medium text-text">{link.label}</span>
                    <span className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
                      {endpointDetails[link.platform]}
                    </span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-heading text-accent">-&gt;</span>
                  {link.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/"
          className="self-start font-mono text-label uppercase tracking-[0.06em] text-text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          &lt;- full portfolio
        </Link>
      </div>
    </article>
  );
}
