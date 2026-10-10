import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { BootSequence } from '@/components/boot-sequence';
import { PageShell } from '@/components/layout/page-shell';
import { Analytics } from '@vercel/analytics/next';
import { PROFILE } from '@/content/site';
import { CONTENT } from '@/lib/content/model';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0e' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
};

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
    default: 'Gladwin.dev \u00b7 Gladwin Ferdz Del Rosario',
    template: '%s \u00b7 Gladwin.dev',
  },
  description,
  keywords: [
    'Gladwin Ferdz Del Rosario',
    'Cloud Infrastructure',
    'DevOps',
    'Cybersecurity',
    'Systems Engineering',
    'Full-Stack Developer',
    'React',
    'Spring Boot',
    'AWS',
    'Azure',
    'Google Cloud',
  ],
  authors: [{ name: 'Gladwin Ferdz Del Rosario', url: SITE_URL }],
  creator: 'Gladwin Ferdz Del Rosario',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Gladwin Ferdz Del Rosario \u00b7 Systems & Cloud Infrastructure Engineer',
    description,
    siteName: 'Gladwin.dev',
    images: [{ url: '/images/profile.jpg', width: 1600, height: 1067, alt: PROFILE.image.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gladwin Ferdz Del Rosario \u00b7 Systems & Cloud Infrastructure Engineer',
    description,
    creator: '@winontech04',
    images: ['/images/profile.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Gladwin.dev',
      url: SITE_URL,
      description,
      inLanguage: 'en-US',
      publisher: {
        '@id': `${SITE_URL}/#person`,
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: 'Gladwin Ferdz Del Rosario \u00b7 Profile',
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      mainEntity: {
        '@id': `${SITE_URL}/#person`,
      },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PROFILE.name,
      alternateName: 'Gladwin Del Rosario',
      jobTitle: PROFILE.role,
      description: PROFILE.summary,
      url: SITE_URL,
      image: `${SITE_URL}${PROFILE.image.src}`,
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Polytechnic University of the Philippines',
      },
      knowsAbout: [
        'Cloud Infrastructure',
        'Cloud-Native Architecture',
        'Backend Engineering',
        'Distributed Systems',
        'DevOps',
        'Cybersecurity',
        'Full-Stack Development',
        'Amazon Web Services (AWS)',
        'Microsoft Azure',
        'Google Cloud Platform (GCP)',
        'React',
        'Spring Boot',
      ],
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
        <Analytics />
      </body>
    </html>
  );
}
