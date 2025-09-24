import Image from 'next/image';
import { notFound } from 'next/navigation';
import RouteSeo from '../../../../components/route-seo';
import CaseStudyLayout from '../../../../components/case';
import type { Project } from '../../../../data/projects';
import { projects } from '../../../../data/projects';

const accent = { from: '#5865F2', to: '#99A7FF' };

const BUILD_POINTS = [
  'Problem → cross-language voice chats stall momentum.',
  'Constraints → low-latency, Discord-native, readable in chat.',
  'Architecture → Discord voice → streaming STT (Deepgram) → translation → inline bot messages; overlay for captions.',
  'Reliability → reconnection guards, backoff on rate limits, message dedupe for interim/final.',
  'Privacy/UI → per-user language prefs; opt-in overlay.',
];

const WHAT_IT_DOES = [
  'Low-latency interim + final translations',
  'Inline bot messages for translated snippets',
  'Per-user language preferences',
  'Optional overlay for live captions',
  'Reliability focus and graceful fallback states',
];

const STATUS_NEXT = [
  'Hardening reconnect paths and error surfaces',
  'Tuning translation consistency and prompts',
  'Lightweight admin console for room health'
];

function getProject(): Project | undefined {
  return projects.find((item) => item.slug === 'discord-voice-translator');
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
          .split(' ')
          .slice(0, 2)
          .join(' ')
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
      <RouteSeo title="Live Translator for Discord" description="Live translation inside Discord voice channels." />
      <CaseStudyLayout>
        <header className="flex flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.28em] text-accent/80">Flagship</p>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{project.title}</h1>
            <p className="text-base text-foreground/60">{project.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://livecalltranslator.netlify.app/"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              target="_blank"
              rel="noopener"
            >
              Demo
            </a>
            <a
              href="mailto:isiah.udofia@yale.edu"
              className="rounded-full border border-border/60 px-6 py-3 text-sm font-semibold text-foreground transition duration-300 hover:border-accent/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Contact
            </a>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
          <div className="space-y-6 text-base text-foreground/75">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">Build journey</h2>
              <ul className="mt-3 space-y-2">
                {BUILD_POINTS.map((point) => (
                  <li key={point} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">What it does</h2>
              <ul className="mt-3 space-y-2">
                {WHAT_IT_DOES.map((item) => (
                  <li key={item} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-400">Status / Next</h2>
              <ul className="mt-3 space-y-2">
                {STATUS_NEXT.map((item) => (
                  <li key={item} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-surface/70 p-6 shadow-subtle">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(120% 120% at 50% 0%, ${accent.from}22 0%, ${accent.to}11 35%, transparent 70%)`,
                filter: 'blur(18px)',
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
