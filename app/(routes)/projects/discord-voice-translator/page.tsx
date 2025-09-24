import Image from "next/image";
import { notFound } from "next/navigation";
import RouteSeo from "../../../../components/route-seo";
import CaseStudyLayout from "../../../../components/case";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";

const theme = {
  primary: "#5865F2",
  glowFrom: "#7C3AED",
  glowTo: "#A78BFA",
  spaceBg: "#0B1020",
};

const BUILD_POINTS = [
  "Problem: cross-language voice chats lose momentum when translation lags.",
  "Constraints: keep it low-latency, Discord-native, and readable directly in chat.",
  "Architecture: Discord voice → streaming STT (Deepgram) → translation → inline bot messages with overlay option.",
  "Reliability: reconnection guards, rate-limit backoff, and dedupe for interim/final updates.",
  "Privacy/UI: per-user language preferences with an opt-in captions overlay.",
];

const WHAT_IT_DOES = [
  "Low-latency interim and final translations in-channel.",
  "Inline bot messages that surface translated snippets.",
  "Per-user language preferences stored per voice room.",
  "Optional overlay delivering live captions alongside audio.",
  "Reliability focus with graceful fallbacks.",
];

const STATUS_NEXT = [
  "Hardening reconnect and error surfaces.",
  "Tuning translation consistency for tricky phrases.",
  "Lightweight room health console for live monitoring.",
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
          to { transform: translate3d(-5%, -5%, 0); }
        }
      `}</style>
      <CaseStudyLayout>
        <header
          className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-border/40 p-6"
          style={{ backgroundColor: theme.spaceBg }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(120% 120% at 50% 0%, ${theme.glowFrom}33 0%, ${theme.glowTo}11 55%, transparent 90%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-20 motion-reduce:animate-none"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4) 0, transparent 60%), radial-gradient(1px 1px at 80% 30%, rgba(255,255,255,0.3) 0, transparent 60%), radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.35) 0, transparent 60%)",
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
              animation: "drift 30s linear infinite",
            }}
          />
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">FLAGSHIP</p>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-base text-white/70">{project.tagline}</p>
            <a
              href="https://livecalltranslator.netlify.app/"
              className="text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              livecalltranslator.netlify.app
            </a>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://livecalltranslator.netlify.app/"
              target="_blank"
              rel="noopener"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0E1118] transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1118]"
            >
              Open Live Website
            </a>
            <a
              href="mailto:isiah.udofia@yale.edu"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1118]"
            >
              Contact
            </a>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
          <div className="space-y-6 text-base text-foreground/75">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Build journey
              </h2>
              <ul className="mt-3 space-y-2">
                {BUILD_POINTS.map((point) => (
                  <li key={point} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
                What it does
              </h2>
              <ul className="mt-3 space-y-2">
                {WHAT_IT_DOES.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Status / Next
              </h2>
              <ul className="mt-3 space-y-2">
                {STATUS_NEXT.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-surface/70 p-6 shadow-subtle">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(120% 120% at 50% 0%, ${theme.glowFrom}22 0%, ${theme.glowTo}11 60%, transparent 90%)`,
              }}
            />
            <Image
              src={project.thumbnail}
              alt="Live Translator diagram"
              width={960}
              height={640}
              className="relative z-10 w-full rounded-[1.5rem] border border-border/40 bg-background/70 object-cover"
            />
          </div>
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
