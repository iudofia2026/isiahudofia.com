import type { Metadata } from 'next';
import Image from 'next/image';
import RouteSeo from '../../../../components/route-seo';
import CaseStudyLayout from '../../../../components/case';
import { projects } from '../../../../data/projects';

export const metadata: Metadata = {
  title: 'B.S. Thesis — Making Sleep Data Actionable with Machine Learning',
  description: 'Bridging wearable signals and lived experience with calibrated ML and an evidence-constrained explainer.',
};

const project = projects.find((item) => item.slug === 'thesis-abcd-sleep-ml');

if (!project) {
  throw new Error('ABCD Sleep Thesis project data missing');
}

const title = 'B.S. Thesis — Making Sleep Data Actionable with Machine Learning';
const subtitle =
  'Bridging wearable signals and lived experience to produce evidence-backed insights people can actually use.';

const highlights = [
  'Trained Ridge + XGBoost with calibration on thousands of nights of wearable + survey data',
  'Two-layer system: models for accuracy, LLM explainer constrained to peer-reviewed sleep science',
  'Validates against self-reports and cognitive task outcomes to check real-world relevance',
  'Focuses on transparent features and reliable feedback loops instead of black-box scores',
];

const chips = ['Ridge', 'XGBoost', 'Calibration', 'Wearables', 'Evidence-backed'];

export default function ThesisCaseStudy() {
  return (
    <>
      <RouteSeo
        title="B.S. Thesis — Making Sleep Data Actionable with Machine Learning"
        description="Bridging wearable signals and lived experience with calibrated ML and an evidence-constrained explainer."
      />
      <CaseStudyLayout>
        <header className="flex flex-col gap-5">
          <p className="text-sm uppercase tracking-[0.28em] text-accent/80">Research</p>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="text-base text-foreground/60">{subtitle}</p>
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
          {chips.map((chip) => (
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
