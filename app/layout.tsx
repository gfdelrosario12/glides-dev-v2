import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { BootSequence } from '@/components/boot-sequence';
import { PageShell } from '@/components/layout/page-shell';
import './globals.css';

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
  title: {
    default: 'Gladwin.dev',
    template: '%s \u00b7 Gladwin.dev',
  },
  description:
    'Gladwin Ferdz Del Rosario — infrastructure, cloud, cybersecurity, networking, and IT operations, across AWS, Microsoft Azure, and Google Cloud.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <BootSequence />
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
