import { notFound } from "next/navigation";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";

export const metadata = {
  title: "Zen Video Agency",
  description:
    "Editing ops and creative delivery for DTC and creator clients. Premiere Pro + After Effects with a standardized intake → edit → review loop.",
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

  const throughput = ["5 retainers", "~4 short/day", "~2 long/week"];

  const processSteps = [
    { n: 1, t: "Client inputs", d: "Briefs, references, and weekly themes land in shared inbox." },
    { n: 2, t: "Direction rough", d: "Isiah sketches hooks/pacing, sets cut goals and naming." },
    { n: 3, t: "Editor handoff", d: "Two editors take parallel passes for speed and variance." },
    { n: 4, t: "Daily iteration", d: "Notes → new cuts → quick checks; keep what lifts retention." },
    { n: 5, t: "Acceptance", d: "Isiah approves a version and frames it for client review." },
    { n: 6, t: "Client pass", d: "Final changes come back; editors apply and prep deliverables." },
    { n: 7, t: "Ship", d: "Exports, thumbnails, and versioning recorded to template set." },
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
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05) inset, 0 10px 40px -10px rgba(34,211,238,0.15)",
          }}
        />

        <p className="text-xs tracking-[0.22em] text-neutral-400">AGENCY</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-2 max-w-2xl text-neutral-400">{project.tagline}</p>
        <p className="mt-3 max-w-2xl text-neutral-300">
          Built in August 2025 as a lightweight studio for creators and small brands. I’m running a
          repeatable intake → edit → review loop with two remote editors and weekly rhythm so
          delivery quality improves every cycle.
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
            <a
              className="underline underline-offset-2 hover:text-neutral-300"
              href="mailto:isiah.udofia@yale.edu"
            >
              isiah.udofia@yale.edu
            </a>
          </span>

          <div className="ml-auto flex flex-wrap gap-2">
            {throughput.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-neutral-800/70 bg-neutral-950 px-3 py-1 text-xs text-neutral-400"
              >
                {pill}
              </span>
            ))}
          </div>
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
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">
                Process
              </h3>
              <ol className="grid gap-3 sm:grid-cols-2">
                {processSteps.map((s) => (
                  <li
                    key={s.n}
                    className="group relative rounded-xl border border-neutral-900 bg-neutral-950/60 p-4 transition hover:border-neutral-700"
                  >
                    <div className="mb-1 text-xs font-medium tracking-wider text-neutral-400">
                      {String(s.n).padStart(2, "0")}
                    </div>
                    <div className="text-sm font-semibold text-neutral-200">{s.t}</div>
                    <p className="mt-1 text-sm text-neutral-400">{s.d}</p>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                      style={{
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 30px -12px rgba(34,211,238,0.18)",
                      }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <aside>
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Stack</h3>
            <div className="flex flex-wrap gap-2">
              {(chips ?? []).map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-neutral-800/60 bg-neutral-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-400"
                >
                  {chip}
                </span>
              ))}
              {(chips ?? []).length === 0 && (
                <span className="text-xs text-neutral-500">No tags available</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
