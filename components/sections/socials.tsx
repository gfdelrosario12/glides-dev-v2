import { QRCodeSVG } from 'qrcode.react';
import { CONTENT } from '@/lib/content/model';

export function SocialsBand() {
  const links = CONTENT.socialLinks;
  
  if (links.length === 0) return null;

  return (
    <section
      id="socials"
      aria-labelledby="socials-heading"
      className="flex scroll-mt-16 flex-col gap-6"
    >
      <h2 id="socials-heading" className="text-title font-medium text-text">
        Connect & Socials
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <li key={link.platform} className="group flex min-w-0 flex-col items-center gap-4 rounded-md border border-border bg-surface-raised p-6 text-center transition-colors duration-200 hover:border-accent hover:bg-surface-overlay">
            <QRCodeSVG 
              value={link.href}
              size={120}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"M"}
              className="rounded-sm bg-white p-2"
            />
            <div className="flex flex-col gap-1">
              <p className="font-mono text-label uppercase tracking-[0.06em] text-text">
                {link.platform}
              </p>
              <a 
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-full truncate text-small text-accent transition-colors duration-200 group-hover:text-accent-hover hover:underline"
              >
                {link.label}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
