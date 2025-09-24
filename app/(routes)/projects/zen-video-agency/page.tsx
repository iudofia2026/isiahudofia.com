import { notFound } from "next/navigation";
import type { Project } from "../../../data/projects";
import { projects } from "../../../data/projects";

export const metadata = {
  title: "Zen Video Agency",
  description:
    "Editing ops and creative delivery for DTC and creator clients. Premiere + After Effects, standardized intake → editing → QA."
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

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const chips = deriveChips(project);

  return (
    <article className="container py-14">
      <header className="mb-10">
        <p className="text-xs tracking-[0.22em] text-neutral-400">AGENCY</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">{project.tagline}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-300 uppercase">Overview</h2>
            <ul className="list-disc pl-5 text-neutral-300 leading-relaxed">
              {(project.highlights ?? []).map((h, i) => (
                <li key={i} className="mt-1">{h}</li>
              ))}
            </ul>
          </div>

          {(project.links ?? []).length > 0 && (
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-300 uppercase">Links</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {project.links!.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-neutral-800 px-3 py-1 text-neutral-300 hover:border-neutral-700"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-300 uppercase">Stack</h3>
            <div className="flex flex-wrap gap-2">
              {chips.length > 0 ? (
                chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-neutral-800/60 bg-neutral-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-400"
                  >
                    {chip}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-500">No tags available</span>
              )}
            </div>
          </div>

          {(project.metrics ?? []).length > 0 && (
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-neutral-300 uppercase">Notes</h3>
              <ul className="space-y-1 text-sm text-neutral-300">
                {project.metrics!.map((m) => (
                  <li key={m.label}>
                    <span className="text-neutral-400">{m.label}</span>
                    {m.value ? ` · ${m.value}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
