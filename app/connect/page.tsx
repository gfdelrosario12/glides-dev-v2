import type { Metadata as NextMetadata } from 'next';

import { CopyEmailButton } from '@/components/connect/copy-email';
import { TerminalContact } from '@/components/connect/terminal-contact';
import { CONTENT } from '@/lib/content/model';
import { CONTENT_GUTTER, SECTION_RHYTHM } from '@/lib/layout';

export const metadata: NextMetadata = {
  title: 'Connect',
  description: 'Connect, find social profiles, and reach out for collaboration.',
};

export default function ConnectPage() {
  const { socialLinks } = CONTENT;
  const emailLink = socialLinks.find((link) => link.platform === 'email');
  const emailAddress = emailLink?.href.replace('mailto:', '') || '';

  return (
    <article className={`py-12 ${CONTENT_GUTTER}`}>
      <div className={`mx-auto flex max-w-wide flex-col gap-8 ${SECTION_RHYTHM}`}>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-text-muted">
            Connect
          </p>
          <h1 className="text-title font-medium text-text">Contact & Collaboration</h1>
          <p className="max-w-prose text-body text-text-secondary">
            Reach out directly for opportunities or explore other platforms where I build in public.
          </p>
        </div>

        <section className="flex flex-col gap-6" aria-labelledby="links-heading">
          <h2 id="links-heading" className="text-heading font-medium text-text">
            Links & Destinations
          </h2>
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              {socialLinks.map((link) => (
                <li key={link.href} className="flex items-center gap-4">
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-body font-medium text-accent hover:text-accent-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success rounded"
                  >
                    {link.label}
                    {link.external && <span className="sr-only"> (Opens in a new tab)</span>}
                  </a>
                  {link.platform === 'email' && emailAddress && (
                    <CopyEmailButton email={emailAddress} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="terminal-heading">
          <h2 id="terminal-heading" className="text-heading font-medium text-text">
            System Identity
          </h2>
          <TerminalContact />
        </section>
      </div>
    </article>
  );
}
