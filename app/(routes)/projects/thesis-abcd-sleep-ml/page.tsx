import { notFound } from "next/navigation";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";
import Reveal from "../../../../components/thesis/reveal";

export const metadata = {
  title: "B.S. Thesis — Making Sleep Data Actionable with ML",
  description:
    "Starting now: calibrated ML on wearable + survey signals with an evidence-constrained explainer. Transparent features, validated against self-reports and tasks.",
};

function getProject(): Project | undefined {
  return projects.find((p) => p.slug === "thesis-abcd-sleep-ml");
}

function deriveChips(p: Project): string[] {
  if (Array.isArray(p.stack) && p.stack.length) return p.stack.slice(0, 6);
  if (Array.isArray(p.metrics) && p.metrics.length) return p.metrics.map((m) => m.label).slice(0, 6);
  if (Array.isArray(p.highlights) && p.highlights.length) {
    return p.highlights.slice(0, 5).map((h) => h.split(/[—–-]/)[0].trim());
  }
  return ["Ridge", "XGBoost", "Calibration", "Wearables", "Evidence-backed"];
}

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const chips = deriveChips(project);

  const sunsetFrom = "#EA580C";
  const sunsetTo = "#DC2626";

  const bullets = [
    "Train calibrated Ridge + XGBoost on multi-night wearable + survey features; prefer reliability over raw score chasing.",
    "Two-layer design: models for accuracy + an explainer constrained to peer-reviewed sleep science (guardrails over style).",
    "Validate against self-reports and cognitive tasks to check real-world relevance, not just dev metrics.",
    "Emphasize transparent features and feedback loops so people understand why a suggestion was made.",
  ];

  const milestones = [
    { k: "M1", t: "Data ready", d: "Clean/align nights, engineer ~100–120 features, audit leakage.", w: "Weeks 1–3" },
    { k: "M2", t: "Baselines + calibration", d: "Ridge + XGBoost; reliability curves (ECE/Brier), thresholds.", w: "Weeks 4–6" },
    { k: "M3", t: "Validation", d: "Compare to self-reports & task outcomes; error analysis on subgroups.", w: "Weeks 7–9" },
    { k: "M4", t: "Constrained explainer", d: "LLM explanations bound to vetted sleep sources; safety checks.", w: "Weeks 10–12" },
    { k: "M5", t: "Pilot feedback", d: "Transparent features + next-best actions; small user tests.", w: "Weeks 13–15" },
  ];

  const success = [
    "Well-calibrated predictions (e.g., ECE < 0.05) with clear calibration plots.",
    "Advisor-reviewed feature attributions that align with sleep science.",
    "Users can accurately restate ‘why’ behind a suggestion in brief tests.",
    "No safety violations or off-source claims in the explainer.",
  ];

  const advisor = "Prof. Arielle Baskin-Sommers (Dept. of Psychology, Yale)";

  return (
    <article className="container py-14">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-950/60 px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-15"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${sunsetFrom}, ${sunsetTo})`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,1) 68%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 14px 60px -20px rgba(220,38,38,0.25)",
          }}
        />

        <p className="text-xs tracking-[0.22em] text-neutral-400">RESEARCH</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
          B.S. Thesis — Making Sleep Data Actionable with Machine Learning
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-300">
          Starting this year: bridge wearable signals and lived experience to produce evidence-backed guidance people can actually use.
        </p>
        <p className="mt-2 text-sm text-neutral-400">Advisor: {advisor}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.24em] text-orange-300/80">
          Current status: data cleaning + feature audits
        </p>

        {(chips ?? []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-neutral-800/60 bg-neutral-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-300"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* MOTIVATION / WHY CARD */}
      <section
        className="mt-6 rounded-3xl border border-neutral-800/70 bg-gradient-to-b from-[#8a2c20]/15 via-[#c14b2a]/10 to-transparent p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
        aria-label="Why this thesis"
      >
        <p className="text-[15px] leading-7 text-neutral-200">
          I’m building this thesis to <span className="font-semibold">turn sleep signals into guidance people can trust</span>.
          Instead of chasing leaderboard scores, I’m focusing on <span className="font-semibold">calibrated models</span> and an
          explainer that’s <span className="font-semibold">constrained to peer-reviewed sleep science</span>. The goal is
          product-minded rigor: transparent features, reliable feedback, and recommendations that feel usable in real life.
          Advised by <span className="font-medium">Prof. Arielle Baskin-Sommers</span>, I’m starting this year with data cleaning and feature audits, then moving toward baselines, calibration, validation, and a constrained explainer.
        </p>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="space-y-8">
          <Reveal>
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Project approach</h2>
            <ul className="list-disc pl-5 leading-relaxed text-neutral-300">
              {bullets.map((b) => (
                <li key={b} className="mt-1">
                  {b}
                </li>
              ))}
            </ul>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Milestones (in progress)</h2>
            <ol className="grid gap-3 sm:grid-cols-2">
              {milestones.map((m, i) => (
                <li key={m.k} className="relative rounded-xl border border-neutral-900 bg-neutral-950/70 p-4">
                  <div className="mb-1 text-xs font-medium tracking-wider text-neutral-400">
                    {m.k} • {m.w}
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">{m.t}</div>
                  <p className="mt-1 text-sm text-neutral-400">{m.d}</p>
                  {i === 0 && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl"
                      style={{ boxShadow: `inset 0 0 0 1px ${sunsetFrom}22, 0 10px 30px -12px ${sunsetTo}33` }}
                    />
                  )}
                </li>
              ))}
            </ol>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">What success looks like</h2>
            <ul className="list-disc pl-5 leading-relaxed text-neutral-300">
              {success.map((s) => (
                <li key={s} className="mt-1">
                  {s}
                </li>
              ))}
            </ul>
            </div>
          </Reveal>
        </section>

      </div>
    </article>
  );
}
