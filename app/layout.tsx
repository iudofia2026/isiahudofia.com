import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import PageTransition from '../components/page-transition';
import DefaultSeoConfig from '../components/default-seo-config';
import Analytics from '../components/analytics';

const siteUrl = 'https://www.isiahudofia.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Isiah Udofia',
    default: 'Isiah Udofia | Product Builder',
  },
  description: 'Product builder pairing translation, ops, and research rigor.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Isiah Udofia | Product Builder',
    description: 'Product builder pairing translation, ops, and research rigor.',
    siteName: 'Isiah Udofia',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Isiah Udofia portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isiah Udofia | Product Builder',
    description: 'Product builder pairing translation, ops, and research rigor.',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  authors: [{ name: 'Isiah Udofia' }],
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <DefaultSeoConfig />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <PageTransition>
            <main className="flex-1 px-4 pb-20 pt-28 sm:px-6 lg:px-20 xl:px-28">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
