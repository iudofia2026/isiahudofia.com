import { notFound } from "next/navigation";
import type { Project } from "../../../data/projects";
import { projects } from "../../../data/projects";

export const metadata = {
  title: "Zen Video Agency",
  description:
    "Editing ops and creative delivery for DTC and creator clients. Premiere Pro + After Effects, standardized intake → editing → QA.",
};

const OVERVIEW_POINTS = [
  "Launched Aug 2025; managing 5 creator/brand clients with ongoing deliverables.",
  "Standardized intake → editing → QA pipeline ensures predictable delivery.",
  "Playbooks for client communication and retention.",
  "Delegated editing workflows to 2 remote editors, with async review flows.",
];

const STACK = ["Premiere Pro", "After Effects", "Client QA Workflows"];
const LINK = {
  label: "Visit Agency Site",
  href: "https://heroic-puppy-1a67b8.netlify.app/",
};

const accentFrom = "#0EA5E9";
const accentTo = "#22D3EE";

function getProject(): Project | undefined {
  return projects.find((p) => p.slug === "zen-video-agency");
}

export default function Page() {
  const project = getProject();
  if (!project) return notFound();

  const chips = STACK;

  return (
    <article className="container relative py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 rounded-b-[2.5rem] opacity-10"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, ${accentFrom}, ${accentTo})`,
        }}
      />

      <header className="mb-10">
        <p className="text-xs tracking-[0.22em] text-neutral-400">AGENCY</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50 md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-400">{project.tagline}</p>
        <p className="mt-4 max-w-2xl text-neutral-300">
          Built in August 2025 as a lightweight studio for creators and small brands. I’m piloting a repeatable intake → edit → QA loop, managing two remote editors, and tightening feedback rituals so delivery quality improves every week.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Overview</h2>
            <ul className="list-disc pl-5 leading-relaxed text-neutral-300">
              {OVERVIEW_POINTS.map((point) => (
                <li key={point} className="mt-1">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <a
              href={LINK.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-neutral-800 bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-700 hover:text-white"
            >
              {LINK.label}
            </a>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">Stack</h3>
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
        </aside>
      </div>
    </article>
  );
}
