import { notFound } from "next/navigation";
import type { Project } from "../../../../data/projects";
import { projects } from "../../../../data/projects";

export const metadata = {
  title: "Zen Video Agency",
  description:
    "Editing ops and creative delivery for DTC and creator clients. Premiere + After Effects, standardized intake → editing → QA.",
};

const OVERVIEW_POINTS = [
  "Launched Aug 2025; managing 5 creator/brand clients with ongoing deliverables.",
  "Standardized intake → editing → QA pipeline ensures predictable delivery.",
  "Playbooks for client communication and retention.",
  "Delegated editing workflows to 2 remote editors, with async review flows.",
];

const STACK = ["Premiere Pro", "After Effects", "Client QA Workflows"];

function getProject(): Project | undefined {
  return projects.find((p) => p.slug === "zen-video-agency");
}

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const stack = STACK;
  const links = project.links ?? [];

  return (
    <article className="container py-14">
      <header className="mb-10">
        <p className="text-xs tracking-[0.22em] text-neutral-400">AGENCY</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">{project.tagline}</p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Overview</h2>
            <ul className="list-disc pl-5 text-neutral-300 leading-relaxed">
              {OVERVIEW_POINTS.map((point) => (
                <li key={point} className="mt-1">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {links.length > 0 && (
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Links</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-neutral-800 px-3 py-1 text-neutral-300 hover:border-neutral-700"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Stack</h3>
            <div className="flex flex-wrap gap-2">
              {stack.length > 0 ? (
                stack.map((chip) => (
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
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Notes</h3>
              <ul className="space-y-1 text-sm text-neutral-300">
                {project.metrics!.map((m) => (
                  <li key={m.label}>
                    <span className="text-neutral-400">{m.label}</span>
                    {m.value ? ` · ${m.value}` : ''}
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
