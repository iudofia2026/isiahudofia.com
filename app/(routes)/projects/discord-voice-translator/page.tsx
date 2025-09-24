import { notFound } from "next/navigation";
import RouteSeo from "../../../../components/route-seo";
import CaseStudyLayout from "../../../../components/case";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";
import PipelineDiagram from "../../../../components/discord/PipelineDiagram";
import Timeline from "../../../../components/ui/Timeline";

const theme = {
  indigo: "#5865F2",
  glowFrom: "#7C3AED",
  glowTo: "#A78BFA",
};

const steps = [
  { title: "Problem", body: "Cross-language voice chats lose momentum when translation lags." },
  { title: "Constraints", body: "Low-latency, Discord-native, readable directly in chat." },
  {
    title: "Architecture",
    body: "Discord voice → streaming STT (Deepgram) → translation → inline bot; optional overlay.",
  },
  { title: "Reliability", body: "Reconnection guards, rate-limit backoff, interim/final dedupe." },
  { title: "Privacy & UI", body: "Per-user language prefs; opt-in overlay." },
  {
    title: "Status / Next",
    body: "Hardening reconnect paths, tuning translation consistency, room-health console.",
  },
];

const features = [
  "Low-latency interim and final translations",
  "Inline bot messages surfaced in-channel",
  "Per-user language preferences",
  "Optional overlay for live captions",
  "Reliability focus with graceful fallbacks",
];

const statusNext = [
  "Hardening reconnect and error surfaces",
  "Tuning translation consistency",
  "Lightweight room health console",
];

function getProject(): Project | undefined {
  return projects.find((item) => item.slug === "discord-voice-translator");
}

function deriveChips(project: Project): string[] {
  if (Array.isArray(project.stack) && project.stack.length) {
    return project.stack.slice(0, 5);
  }
  if (Array.isArray(project.metrics) && project.metrics.length) {
    return project.metrics.map((m) => m.label).slice(0, 5);
  }
  if (Array.isArray(project.highlights) && project.highlights.length) {
    return project.highlights
      .slice(0, 4)
      .map((h) =>
        h
          .split(/[—–-]/)[0]
          .trim()
          .split(" ")
          .slice(0, 2)
          .join(" ")
      );
  }
  return [];
}

export default function DiscorderCaseStudy() {
  const project = getProject();
  if (!project) {
    return notFound();
  }

  const chips = deriveChips(project);

  return (
    <>
      <RouteSeo
        title="Live Translator for Discord"
        description="Live translation inside Discord voice channels."
      />
      <style>{`
        @keyframes drift {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-4%, -6%, 0); }
        }
      `}</style>
      <CaseStudyLayout>
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090d1f] px-6 py-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-15"
            style={{
              background: `radial-gradient(120% 120% at 50% 0%, ${theme.glowFrom}, ${theme.glowTo})`,
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,1) 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-20 motion-safe:animate-[drift_30s_linear_infinite]"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4) 0, transparent 60%), radial-gradient(1px 1px at 80% 30%, rgba(255,255,255,0.3) 0, transparent 60%), radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.35) 0, transparent 60%)",
              backgroundSize: "200px 200px",
            }}
          />
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">FLAGSHIP</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-2 max-w-2xl text-white/70">{project.tagline}</p>
          <a
            href="https://livecalltranslator.netlify.app/"
            className="mt-1 text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            livecalltranslator.netlify.app
          </a>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://livecalltranslator.netlify.app/"
              target="_blank"
              rel="noopener"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111629] transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111629]"
            >
              Open Live Website
            </a>
            <a
              href="mailto:isiah.udofia@yale.edu"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111629]"
            >
              Contact
            </a>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
          <div className="space-y-6 text-base text-foreground/75">
            <Timeline steps={steps} />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_60px_-40px_rgba(124,58,237,0.8)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">What it does</h2>
              <ul className="mt-3 space-y-2">
                {features.map((item) => (
                  <li key={item} className="leading-relaxed text-neutral-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_60px_-40px_rgba(124,58,237,0.8)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Status / Next</h2>
              <ul className="mt-3 space-y-2">
                {statusNext.map((item) => (
                  <li key={item} className="leading-relaxed text-neutral-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <PipelineDiagram className="bg-[#0d142a]" />
        </section>

        <section className="flex flex-wrap gap-2">
          {chips.length > 0 ? (
            chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/50 bg-surface/80 px-4 py-1 text-xs uppercase tracking-[0.18em] text-foreground/60"
              >
                {chip}
              </span>
            ))
          ) : (
            <span className="text-xs text-foreground/50">No tags available</span>
          )}
        </section>
      </CaseStudyLayout>
    </>
  );
}
