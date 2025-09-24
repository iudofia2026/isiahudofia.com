import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.isiahudofia.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/projects',
    '/projects/discord-voice-translator',
    '/projects/zen-video-agency',
    '/projects/thesis-abcd-sleep-ml',
    '/about',
    '/contact',
    '/resume',
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));
}
