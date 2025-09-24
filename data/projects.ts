export type Swatch = { from: string; to: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  dates?: string;
  stack: string[];
  highlights: string[];
  links?: { label: string; href: string }[];
  metrics?: { label: string; value: string }[];
  thumbnail: string;
  logo: string;
  gradient?: Swatch;
  chips: string[];
};

export const projects: Project[] = [
  {
    slug: 'discord-voice-translator',
    title: 'Live Translator for Discord',
    tagline: 'Live translation inside Discord voice channels.',
    dates: '2025',
    stack: ['Discord API', 'Deepgram STT', 'OpenAI Translation', 'TypeScript', 'WebSocket'],
    highlights: [
      'Live transcription + interim/final translations',
      'Per-user language prefs; inline bot translations',
      'Optional overlay; reliability focus',
    ],
    links: [
      { label: 'Case Study', href: '/projects/discord-voice-translator' },
      { label: 'Demo', href: 'https://livecalltranslator.netlify.app/' },
    ],
    metrics: [
      { label: '<250ms interim', value: '' },
      { label: 'sub-second final', value: '' },
    ],
    thumbnail: '/thumbnails/discord.svg',
    logo: '/brands/discorder.png',
    gradient: { from: '#60A5FA', to: '#8B5CF6' },
    chips: ['<250ms interim', 'Sub-second final', 'Inline bot', 'Per-user language', 'Overlay'],
  },
  {
    slug: 'zen-video-agency',
    title: 'Zen Video Agency',
    tagline: 'Editing ops that lift retention for creators.',
    dates: '2025',
    stack: ['Premiere/AE', 'Frame.io', 'Notion', 'Zapier'],
    highlights: [
      'Ops pipeline + QA checklists',
      'Team management across editors',
      'CTR/retention gains from stronger hooks',
    ],
    links: [
      { label: 'Case Study', href: '/projects/zen-video-agency' },
      { label: 'Playbook Highlights', href: '#' },
    ],
    metrics: [
      { label: 'MRR', value: '~$2k' },
      { label: 'Retainers', value: '5' },
      { label: 'Editors', value: '2' },
    ],
    thumbnail: '/thumbnails/zen.svg',
    logo: '/brands/zen.png',
    gradient: { from: '#FB923C', to: '#F472B6' },
    chips: ['MRR ~$2k', '5 retainers', '2 editors', 'Async reviews'],
  },
  {
    slug: 'thesis-abcd-sleep-ml',
    title: 'B.S. Thesis — ML for Actionable Sleep Feedback',
    tagline: 'Calibrated models + evidence-constrained explainer.',
    dates: '2025–26',
    stack: ['Ridge', 'XGBoost', 'Calibration', 'Wearables'],
    highlights: [
      'Bridge wearable signals and lived experience',
      'Two-layer system: models + peer-reviewed LLM explainer',
      'Validated on self-reports and tasks',
    ],
    links: [
      { label: 'Case Study', href: '/projects/thesis-abcd-sleep-ml' },
      { label: 'Overview', href: '#' },
    ],
    thumbnail: '/thumbnails/thesis.svg',
    logo: '/brands/thesis.png',
    gradient: { from: '#22D3EE', to: '#3B82F6' },
    chips: ['Ridge', 'XGBoost', 'Calibration', 'Wearables', 'Evidence-backed'],
  },
];
