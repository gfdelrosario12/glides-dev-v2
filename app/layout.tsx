import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { BootSequence } from '@/components/boot-sequence';
import { PageShell } from '@/components/layout/page-shell';
import { PROFILE } from '@/content/site';
import { CONTENT } from '@/lib/content/model';
import './globals.css';

const SITE_URL = 'https://gladwin.dev';
const description =
  'Gladwin Ferdz Del Rosario is an infrastructure, cloud, cybersecurity, and networking engineer working across dependable systems and IT operations.';

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Gladwin.dev',
    template: '%s \u00b7 Gladwin.dev',
  },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Gladwin.dev',
    description,
    siteName: 'Gladwin.dev',
    images: [{ url: '/images/profile.jpg', width: 1600, height: 1067, alt: PROFILE.image.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gladwin.dev',
    description,
    images: ['/images/profile.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Gladwin.dev',
      url: SITE_URL,
      description,
    },
    {
      '@type': 'Person',
      name: PROFILE.name,
      jobTitle: PROFILE.role,
      description: PROFILE.summary,
      url: SITE_URL,
      image: `${SITE_URL}${PROFILE.image.src}`,
      sameAs: CONTENT.socialLinks.filter((link) => link.external).map((link) => link.href),
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const theme = localStorage.getItem('gladwin-theme'); if (theme === 'light') { document.documentElement.dataset.theme = 'light'; document.documentElement.style.colorScheme = 'light'; } } catch {} })()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <BootSequence />
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
