import Script from 'next/script';
import CaseStudyLayout from '../../../../components/case';
import Section from '../../../../components/section';
import RouteSeo from '../../../../components/route-seo';
import { projects } from '../../../../data/projects';

const project = projects.find((item) => item.slug === 'thesis-abcd-sleep-ml');

if (!project) {
  throw new Error('Thesis project data missing');
}

export default function ThesisCaseStudy() {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: project.title,
    description: project.tagline,
    url: `https://www.isiahudofia.com/projects/${project.slug}`,
    creator: {
      '@type': 'Person',
      name: 'Isiah Udofia',
    },
    keywords: project.stack,
    additionalProperty: project.metrics?.map((metric) => ({
      '@type': 'PropertyValue',
      name: metric.label,
      value: metric.value,
    })),
  };

  return (
    <>
      <RouteSeo
        title="Thesis — ABCD Sleep + ML"
        description="Predicting adolescent sleep risk from the ABCD dataset using Ridge and XGBoost ensembles."
      />
      <Script id="thesis-schema" type="application/ld+json">
        {JSON.stringify(projectSchema)}
      </Script>
      <Section eyebrow="Thesis" title="Modeling adolescent sleep risk from multi-modal signals.">
        <p className="text-lg text-foreground/75">
          For my Yale cognitive science thesis, I explored how multi-modal ABCD cohort data could power an early warning
          system for adolescent sleep issues. I led research design, feature engineering, modeling, and ethical reviews.
        </p>
      </Section>
      <CaseStudyLayout project={project}>
        <CaseSection title="Problem">
          Clinicians manage sleep disorders reactively even though the ABCD dataset captures longitudinal behavioral,
          physiological, and psychological signals. We needed a risk model that could be trusted and explained.
        </CaseSection>
        <CaseSection title="Approach">
          <ul className="space-y-3">
            <li>
              Engineered 120+ features spanning actigraphy, cortisol assays, screen-time diaries, and NIH Toolbox tasks;
              applied missingness-aware preprocessing.
            </li>
            <li>
              Trained Ridge Regression and XGBoost ensembles with nested cross-validation, then calibrated probability
              buckets using isotonic regression to protect interpretability.
            </li>
            <li>
              Used SHAP + counterfactual analysis to surface which behaviors and biomarkers drove risk scores.
            </li>
          </ul>
        </CaseSection>
        <CaseSection title="Result">
          <ul className="space-y-3">
            <li>
              Achieved <strong>0.82 AUC</strong> with &lt;3% calibration error across deciles.
            </li>
            <li>Identified evening screen time variance and cortisol volatility as leading indicators clinicians could act on earlier.</li>
            <li>Packaged findings into an interactive dashboard and policy memo for the Yale Sleep Lab steering group.</li>
          </ul>
        </CaseSection>
        <CaseSection title="Limitations & Ethics">
          <ul className="space-y-3">
            <li>Model performance varies by demographic subgroup; further fairness auditing and data augmentation required.</li>
            <li>Consent pathways for using biometric data in proactive alerts need institutional review board approval.</li>
            <li>Clinician-in-the-loop UX must prevent overreliance on automated scores.</li>
          </ul>
        </CaseSection>
        <CaseSection title="Next Steps">
          <ul className="space-y-3">
            <li>Prototype a clinician dashboard with scenario planning and counterfactual recommendations.</li>
            <li>Explore semi-supervised learning to leverage unlabeled longitudinal visits.</li>
            <li>Partner with the ABCD ethics board to define data minimization requirements.</li>
          </ul>
        </CaseSection>
      </CaseStudyLayout>
    </>
  );
}

type CaseSectionProps = {
  title: string;
  children: React.ReactNode;
};

function CaseSection({ title, children }: CaseSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <div className="text-base leading-relaxed text-foreground/75">{children}</div>
    </section>
  );
}
