import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";

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

function CardShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className={
        "rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 lg:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] " +
        className
      }
    >
      {children}
    </motion.section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">{children}</p>;
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-1 text-lg font-semibold tracking-tight">{children}</h3>;
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
    { k: "M1", w: "Weeks 1–3", title: "Data ready", desc: "Clean/align nights, engineer ~100–120 features, audit leakage." },
    { k: "M2", w: "Weeks 4–6", title: "Baselines + calibration", desc: "Ridge + XGBoost; ECE/Brier; thresholds." },
    { k: "M3", w: "Weeks 7–9", title: "Validation", desc: "Compare to self-reports & task outcomes; subgroup error analysis." },
    { k: "M4", w: "Weeks 10–12", title: "Constrained explainer", desc: "LLM explanations bound to vetted sleep sources; safety checks." },
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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-8">
        <CardShell>
          <Label>Project approach</Label>
          <H3>Evidence-constrained models with human-readable feedback</H3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-300">
            {bullets.map((b) => (
              <li key={b} className="list-disc pl-4">
                {b}
              </li>
            ))}
          </ul>
        </CardShell>

        <CardShell>
          <Label>Milestones (in progress)</Label>
          <H3>Q1 semester plan</H3>
          <ol className="mt-4 grid grid-cols-1 gap-3">
            {milestones.map((m) => (
              <li key={m.k} className="rounded-lg border border-neutral-800/70 bg-neutral-900/30 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">{m.k} · {m.w}</p>
                <p className="mt-1 font-medium text-neutral-100">{m.title}</p>
                <p className="mt-1 text-sm text-neutral-300">{m.desc}</p>
              </li>
            ))}
          </ol>
        </CardShell>
      </div>

      <CardShell className="mt-6 lg:mt-8">
        <Label>Success signals</Label>
        <H3>Evidence that the thesis delivers value</H3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-300">
          {success.map((s) => (
            <li key={s} className="list-disc pl-4">
              {s}
            </li>
          ))}
        </ul>
      </CardShell>
    </article>
  );
}
