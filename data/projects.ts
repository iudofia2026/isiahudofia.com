export type Project = {
  slug: string;
  title: string;
  tagline: string;
  thumbnail: string;
  chips: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: 'discord-voice-translator',
    title: 'Live Translator for Discord',
    tagline: 'Live translation inside Discord voice channels.',
    thumbnail: '/thumbnails/discord.svg',
    chips: ['<250ms interim', 'Sub-second final', 'Inline bot', 'Per-user language', 'Overlay'],
    links: [
      { label: 'Case Study', href: '/projects/discord-voice-translator' },
      { label: 'Demo', href: 'https://livecalltranslator.netlify.app/' },
    ],
  },
  {
    slug: 'zen-video-agency',
    title: 'Zen Video Agency',
    tagline: 'Editing ops that lift retention for creators.',
    thumbnail: '/thumbnails/zen.svg',
    chips: ['MRR ~$2k', '5 retainers', '2 editors', 'Async reviews'],
    links: [{ label: 'Case Study', href: '/projects/zen-video-agency' }],
  },
  {
    slug: 'thesis-abcd-sleep-ml',
    title: 'ABCD Sleep Thesis',
    tagline: 'Evidence-constrained ML on ABCD sleep data.',
    thumbnail: '/thumbnails/thesis.svg',
    chips: ['Ridge', 'XGBoost', 'Calibration', 'Wearables'],
    links: [{ label: 'Case Study', href: '/projects/thesis-abcd-sleep-ml' }],
  },
];
