import type { DefaultSeoProps } from 'next-seo';

const siteUrl = 'https://www.isiahudofia.com';

const config: DefaultSeoProps = {
  title: 'Isiah Udofia | Product Builder',
  description: 'Product builder pairing translation, ops, and research rigor.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
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
    handle: '@isiahudofia',
    site: '@isiahudofia',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    { name: 'theme-color', content: '#0a0a0a' },
  ],
};

export default config;
