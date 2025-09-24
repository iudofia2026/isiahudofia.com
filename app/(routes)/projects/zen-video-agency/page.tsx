import { notFound } from "next/navigation";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";
import AnimatedTimeline from "../../../../components/zen/animated-timeline";

export const metadata = {
  title: "Zen Video Agency",
  description:
    "Editing ops and creative delivery for DTC and creator clients. Premiere Pro + After Effects with a repeatable intake → edit → review loop.",
};

function getProject(): Project | undefined {
  return projects.find((p) => p.slug === "zen-video-agency");
}

function deriveChips(p: Project): string[] {
  if (Array.isArray(p.stack) && p.stack.length) return p.stack.slice(0, 4);
  if (Array.isArray(p.metrics) && p.metrics.length) return p.metrics.map((m) => m.label).slice(0, 4);
  if (Array.isArray(p.highlights) && p.highlights.length) {
    return p.highlights.slice(0, 4).map((h) => h.split(/[—–-]/)[0].trim());
  }
  return [];
}

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const chips = deriveChips(project);

  const accentFrom = "#0EA5E9";
  const accentTo = "#22D3EE";

  const cadence = [
    { label: "Retainer clients", value: "5" },
    { label: "Short-form / day", value: "~4" },
    { label: "Long-form / week", value: "~2" },
  ];

  const steps: { title: string; body: string }[] = [
    {
      title: "Weekly kickoff (client call)",
      body:
        "One call sets themes, priorities, and references for the week. We agree on the target outputs and what success looks like.",
    },
    {
      title: "Daily production loop",
      body:
        "Isiah roughs direction and naming, then hands off to two editors for parallel passes. Notes → revisions → quick checks until a review-ready cut emerges.",
    },
    {
      title: "Mid-week checkpoint",
      body:
        "Asynchronous review to course-correct: swap hooks, adjust pacing, or re-prioritize clips to maximize retention.",
    },
    {
      title: "Publish & reset",
      body:
        "End-of-week assets (exports, thumbnails, captions) are versioned to templates and queued for posting. Close the loop and prep inputs for next week’s kickoff.",
    },
  ];

  return (
    <article className="container py-14">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-950/60 px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-10"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${accentFrom}, ${accentTo})`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,1) 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 10px 40px -10px rgba(34,211,238,0.15)",
          }}
        />

        <p className="text-xs tracking-[0.22em] text-neutral-400">AGENCY</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-2 max-w-2xl text-neutral-400">{project.tagline}</p>
        <p className="mt-3 max-w-2xl text-neutral-300">
          Built in August 2025 as a lightweight studio for creators and small brands. I run a repeatable intake → edit → review loop with two remote editors and a weekly rhythm so delivery quality improves every cycle.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="https://zeneditingagency.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-900 transition hover:bg-white hover:shadow-[0_6px_24px_-8px_rgba(255,255,255,0.4)]"
          >
            Visit Agency Site
          </a>
          <span className="text-xs text-neutral-500">
            or email{" "}
            <a className="underline underline-offset-2 hover:text-neutral-300" href="mailto:isiah.udofia@yale.edu">
              isiah.udofia@yale.edu
            </a>
          </span>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Overview</h2>
            <ul className="list-disc pl-5 leading-relaxed text-neutral-300">
              {(project.highlights ?? []).map((h, i) => (
                <li key={i} className="mt-1">
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-300">Weekly → Daily loop</h3>
              <AnimatedTimeline steps={steps} />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Delivery cadence</h3>
            <ul className="space-y-2">
              {cadence.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-neutral-900 bg-neutral-950/70 px-3 py-2"
                >
                  <span className="text-xs text-neutral-400">{row.label}</span>
                  <span className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-neutral-200">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {(chips ?? []).length > 0 && (
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Stack</h3>
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
