export type Project = {
  slug: string;
  title: string;
  tagline: string;
  dates?: string;
  stack: string[];
  highlights: string[];
  links?: { label: string; href: string }[];
  metrics?: { label: string; value?: string }[];
  logo?: string;
  gradient?: { from: string; to: string };
};

export const projects: Project[] = [
  {
    slug: "discord-voice-translator",
    title: "Live Translator for Discord",
    tagline: "Live translation inside Discord voice channels.",
    dates: "2025 — Present",
    stack: ["Discord API", "Deepgram STT", "TypeScript", "WebSocket"],
    highlights: [
      "Low-latency interim + final translations",
      "Inline bot messages and per-user language preferences",
      "Optional overlay for live captions"
    ],
    links: [
      { label: "Demo", href: "https://livecalltranslator.netlify.app/" },
      { label: "GitHub", href: "https://github.com/iudofia2026" }
    ],
    // No speculative metrics included
    metrics: [],
    logo: "/brands/discorder.png",
    gradient: { from: "#60A5FA", to: "#8B5CF6" }
  },

  {
    slug: "zen-video-agency",
    title: "Zen Video Agency",
    tagline: "Editing ops and creative delivery for DTC and creator clients.",
    dates: "2022 — Present",
    stack: ["Premiere Pro", "After Effects", "Editor handoff", "Review loops"],
    highlights: [
      "Daily production loop: client inputs → direction rough by Isiah → editor handoff → rapid iteration → Isiah acceptance → client final pass → ship",
      "Two-editor model enables parallel cuts and faster experiments on hooks, pacing, and retention",
      "Lightweight templates and versioning keep deliverables consistent across brands"
    ],
    links: [{ label: "Agency playbook", href: "#" }],
    // Keep metrics empty (no MRR or fabricated numbers)
    metrics: [],
    logo: "/brands/zen.png",
    gradient: { from: "#FB923C", to: "#F472B6" }
  },

  {
    slug: "thesis-abcd-sleep-ml",
    title: "B.S. Thesis — ML for Actionable Sleep Feedback",
    tagline: "Calibrated models and an evidence-constrained explainer for wearable sleep data.",
    dates: "2025 — 2026 (ongoing)",
    stack: ["Ridge", "XGBoost", "Calibration", "Wearables"],
    highlights: [
      "Building a clean nightly feature table from wearable + survey data",
      "Baseline Ridge + XGBoost models with calibration to avoid overconfidence",
      "Planned evidence-constrained explainer (peer-reviewed sources only)",
      "Validation against self-reports and cognitive task outcomes planned"
    ],
    links: [{ label: "Overview", href: "#" }],
    metrics: [],
    logo: "/brands/thesis.png",
    gradient: { from: "#22D3EE", to: "#3B82F6" }
  }
];
