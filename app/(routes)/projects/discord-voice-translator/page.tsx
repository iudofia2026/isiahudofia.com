import { notFound } from "next/navigation";
import RouteSeo from "../../../components/route-seo";
import type { Project } from "../../../data/projects";
import { projects } from "../../../data/projects";
import Timeline, { TimelineStep } from "../../../components/ui/Timeline";

export const metadata = {
  title: "Live Translator for Discord",
  description: "Live translation inside Discord voice channels with low-latency interim and final outputs.",
};

const HERO_THEME = {
  glowFrom: "#7C3AED",
  glowTo: "#A78BFA",
};

const steps: TimelineStep[] = [
  { title: "Problem", body: "Cross-language voice chats lose momentum when translation lags." },
  { title: "Constraints", body: "Low-latency, Discord-native, readable directly in chat." },
  {
    title: "Architecture",
    body: "Discord voice → streaming STT (Deepgram) → translation → inline bot; optional overlay.",
  },
  { title: "Reliability", body: "Reconnection guards, rate-limit backoff, interim/final dedupe." },
  { title: "Privacy & UI", body: "Per-user language preferences; opt-in overlay." },
  { title: "Status / Next", body: "Hardening reconnect paths, tuning translation consistency, room-health console." },
];

function getProject(): Project | undefined {
  return projects.find((p) => p.slug === "discord-voice-translator");
}

function deriveChips(p: Project): string[] {
  if (Array.isArray(p.stack) && p.stack.length) return p.stack.slice(0, 6);
  if (Array.isArray(p.metrics) && p.metrics.length) return p.metrics.map((m) => m.label).slice(0, 6);
  if (Array.isArray(p.highlights) && p.highlights.length) {
    return p.highlights.slice(0, 4).map((h) => h.split(/[—–-]/)[0].trim().split(" ").slice(0, 2).join(" "));
  }
  return [];
}

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const chips = deriveChips(project);

  return (
    <article className="container py-14">
      <RouteSeo
        title="Live Translator for Discord"
        description="Live translation inside Discord voice channels with low-latency interim and final outputs."
      />

      <style>{`
        @keyframes drift {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-4%, -6%, 0); }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0f20] px-6 py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${HERO_THEME.glowFrom}, ${HERO_THEME.glowTo})`,
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
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111629] transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111629]"
          >
            Open Live Website
          </a>
          <a
            href="mailto:isiah.udofia@yale.edu"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111629]"
          >
            Contact
          </a>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-300 uppercase">Build Journey</h2>
            <Timeline steps={steps} />
          </div>
        </section>

        <aside className="space-y-6">
          {(chips ?? []).length > 0 && (
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-300 uppercase">Stack</h3>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-neutral-800/60 bg-neutral-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-400"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
