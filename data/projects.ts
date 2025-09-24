export type Project = {
  slug: string;
  title: string;
  tagline: string;
  dates?: string;
  stack: string[];
  highlights: string[];
  links?: { label: string; href: string }[];
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: 'discord-voice-translator',
    title: 'Discorder',
    tagline: 'AI-powered live translation inside Discord voice rooms',
    dates: '2023 — Present',
    stack: ['Discord API', 'WebRTC', 'Whisper ASR', 'DeepL Translation', 'Next.js'],
    highlights: [
      'Problem → multilingual friend groups bounced between servers because live translation in Discord voice chats does not exist.',
      'Approach → low-latency audio capture with Whisper streaming + DeepL translation, surfaced as Discord stage-side captions.',
      'Result → <250ms end-to-end translation latency with 94% transcription accuracy across 8 launch languages.',
    ],
    links: [
      { label: 'Demo (coming soon)', href: 'https://demo.isiahudofia.com/discorder' },
      { label: 'GitHub', href: 'https://github.com/iudofia2026' },
    ],
    metrics: [
      { label: 'End-to-end latency', value: '<250 ms median' },
      { label: 'Languages supported at launch', value: '8' },
      { label: 'Session retention', value: '82% over 5 pilot groups' },
    ],
  },
  {
    slug: 'zen-video-agency',
    title: 'Zen Video Agency',
    tagline: 'Full-funnel video agency for DTC wellness brands',
    dates: '2022 — 2024',
    stack: ['Notion CRM', 'Figma', 'After Effects', 'Zapier Automation', 'Airtable QA'],
    highlights: [
      'Problem → wellness founders churned through freelancers because briefs, editing, and revisions lacked an operating rhythm.',
      'Approach → codified creative briefs, async review loops, and a Zapier + Airtable pipeline to keep editors, clients, and QA aligned.',
      'Result → Grew to ~$2k MRR with five retainer clients while managing two editors and hitting consistent CTR + retention lifts.',
    ],
    links: [
      { label: 'Showreel (placeholder)', href: 'https://demo.isiahudofia.com/zen-video' },
    ],
    metrics: [
      { label: 'Monthly recurring revenue', value: '~$2k' },
      { label: 'Retainer clients', value: '5' },
      { label: 'Editors managed', value: '2' },
    ],
  },
  {
    slug: 'thesis-abcd-sleep-ml',
    title: 'Thesis: ABCD Sleep + ML',
    tagline: 'Predicting adolescent sleep risk from ABCD cohort signals',
    dates: '2024',
    stack: ['ABCD Dataset', 'Python', 'Ridge Regression', 'XGBoost', 'Calibration Curves'],
    highlights: [
      'Problem → clinicians lack early-warning tooling for adolescent sleep risk despite rich physiological and behavioral datasets.',
      'Approach → engineered 120+ features from actigraphy, questionnaires, and neurocognitive tasks; trained Ridge + XGBoost ensembles with calibration and SHAP explainability.',
      'Result → AUC 0.82 with well-calibrated risk buckets, uncovering feature importance patterns tied to evening screen time and cortisol variance.',
    ],
    links: [
      { label: 'Research write-up', href: 'https://demo.isiahudofia.com/thesis' },
    ],
    metrics: [
      { label: 'Area under ROC', value: '0.82' },
      { label: 'Calibration error', value: '<3% across buckets' },
      { label: 'Feature set', value: '120 engineered signals' },
    ],
  },
];
