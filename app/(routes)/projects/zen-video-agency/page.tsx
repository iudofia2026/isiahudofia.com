import { notFound } from "next/navigation";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";

export const metadata = {
  title: "Zen Video Agency",
  description:
    "Editing ops and creative delivery for DTC and creator clients. Premiere Pro + After Effects with a standardized intake → edit → QA pipeline.",
};

function getProject(): Project | undefined {
  return projects.find((p) => p.slug === "zen-video-agency");
}

function deriveChips(p: Project): string[] {
  if (Array.isArray(p.stack) && p.stack.length) return p.stack.slice(0, 5);
  if (Array.isArray(p.metrics) && p.metrics.length) return p.metrics.map((m) => m.label).slice(0, 5);
  if (Array.isArray(p.highlights) && p.highlights.length) {
    return p.highlights
      .slice(0, 4)
      .map((h) => h.split(/[—–-]/)[0].trim().split(" ").slice(0, 2).join(" "));
  }
  return [];
}

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const chips = deriveChips(project);

  const accentFrom = "#0EA5E9";
  const accentTo = "#22D3EE";

  return (
    <article className="container py-14">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-950/60 px-6 py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-10"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${accentFrom}, ${accentTo})`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,1) 70%)",
          }}
        />
        <p className="text-xs tracking-[0.22em] text-neutral-400">AGENCY</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-2 max-w-2xl text-neutral-400">{project.tagline}</p>
        <p className="mt-3 max-w-2xl text-neutral-300">
          Built in August 2025 as a lightweight studio for creators and small brands. I’m piloting a
          repeatable intake → edit → QA loop, managing two remote editors, and tightening feedback
          rituals so delivery quality improves every week.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="https://zeneditingagency.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            Visit Agency Site
          </a>
          <span className="text-xs text-neutral-500">
            or email{' '}
            <a
              className="underline underline-offset-2 hover:text-neutral-300"
              href="mailto:isiah.udofia@yale.edu"
            >
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
              {(project.highlights ?? [
                "Launched Aug 2025; managing 5 creator/brand clients with ongoing deliverables.",
                "Standardized intake → editing → QA pipeline ensures predictable delivery.",
                "Playbooks for client communication and retention.",
                "Delegated editing workflows to 2 remote editors, with async review flows.",
              ]).map((h, i) => (
                <li key={i} className="mt-1">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside>
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/60 p-6">
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
              {chips.length === 0 && (
                <span className="text-xs text-neutral-500">No tags available</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
