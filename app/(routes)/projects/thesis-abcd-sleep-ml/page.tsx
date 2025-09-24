import Image from 'next/image';
import RouteSeo from '../../../../components/route-seo';
import CaseStudyLayout from '../../../../components/case';
import { projects } from '../../../../data/projects';

const project = projects.find((item) => item.slug === 'thesis-abcd-sleep-ml');

if (!project) {
  throw new Error('ABCD Sleep Thesis project data missing');
}

const highlights = [
  '120 wearable + survey features',
  'Ridge + XGBoost stack with calibration',
  'Clinician review loops kept bias in check',
];

export default function ThesisCaseStudy() {
  return (
    <>
      <RouteSeo title="ABCD Sleep Thesis" />
      <CaseStudyLayout>
        <header className="flex flex-col gap-5">
          <p className="text-sm uppercase tracking-[0.28em] text-accent/80">Research</p>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-base text-foreground/60">{project.tagline}</p>
          </div>
        </header>
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
          <ul className="space-y-3 text-base text-foreground/75">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-surface/70 p-6 shadow-subtle">
            <Image
              src={project.thumbnail}
              alt="ABCD thesis chart"
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
