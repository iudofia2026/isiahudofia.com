import Image from 'next/image';
import RouteSeo from '../../../../components/route-seo';
import CaseStudyLayout from '../../../../components/case';
import { projects } from '../../../../data/projects';

const project = projects.find((item) => item.slug === 'discord-voice-translator');

if (!project) {
  throw new Error('Live Translator for Discord project data missing');
}

const bullets = [
  'Low-latency interim + final',
  'Inline bot translations',
  'Per-user language',
  'Optional overlay',
  'Reliability focus',
];

const metrics = ['Interim <250ms', 'Sub-second final'];

export default function DiscorderCaseStudy() {
  return (
    <>
      <RouteSeo title="Live Translator for Discord" />
      <CaseStudyLayout>
        <header className="flex flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.28em] text-accent/80">Flagship</p>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-base text-foreground/60">{project.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <span
                key={metric}
                className="rounded-full border border-border/60 bg-background/80 px-4 py-1 text-xs uppercase tracking-[0.18em] text-foreground/60"
              >
                {metric}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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
          <ul className="space-y-3 text-base text-foreground/75">
            {bullets.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-surface/70 p-6 shadow-subtle">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-foreground/5" aria-hidden />
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
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border/50 bg-surface/80 px-4 py-1 text-xs uppercase tracking-[0.18em] text-foreground/60"
            >
              {chip}
            </span>
          ))}
        </section>
      </CaseStudyLayout>
    </>
  );
}
