import Script from 'next/script';
import CaseStudyLayout from '../../../../components/case';
import Section from '../../../../components/section';
import RouteSeo from '../../../../components/route-seo';
import { projects } from '../../../../data/projects';

const project = projects.find((item) => item.slug === 'zen-video-agency');

if (!project) {
  throw new Error('Zen Video Agency project data missing');
}

export default function ZenVideoAgencyCaseStudy() {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'Project',
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
        title="Zen Video Agency"
        description="Scaling a wellness-focused video agency to ~$2k MRR with operational excellence and creative feedback loops."
      />
      <Script id="zen-video-schema" type="application/ld+json">
        {JSON.stringify(projectSchema)}
      </Script>
      <Section
        eyebrow="Zen Video Agency"
        title="Productizing creative ops for wellness brands."
      >
        <p className="text-lg text-foreground/75">
          I co-founded Zen Video Agency to help wellness brands build durable video funnels. I architected the operating
          system—briefing, editing, QA, and reporting—that allowed us to grow revenue while protecting creative quality.
        </p>
      </Section>
      <CaseStudyLayout project={project}>
        <CaseSection title="Problem">
          Wellness founders churned through freelancers because briefs were ad-hoc, revisions were chaotic, and outcomes
          rarely tied back to funnel metrics.
        </CaseSection>
        <CaseSection title="Approach">
          <ul className="space-y-3">
            <li>
              Stood up a Notion + Airtable command center capturing ICPs, campaign goals, and approved brand assets.
            </li>
            <li>
              Built async review loops with Loom and Figma annotations so clients could prioritise fixes and unblock editors quickly.
            </li>
            <li>
              Automated status updates and QA checklists via Zapier to keep two editors, five retainers, and me aligned without micromanagement.
            </li>
          </ul>
        </CaseSection>
        <CaseSection title="Result">
          <ul className="space-y-3">
            <li>Scaled to <strong>~$2k MRR</strong> while holding 5 retainer clients and 2 editors with 95% on-time delivery.</li>
            <li>Clients saw a 22% average lift in paid social CTR and 18% lift in retention by tightening creative briefs.</li>
            <li>Weekly ritual decks tied creative bets to funnel metrics, building trust with founders and keeping scope crisp.</li>
          </ul>
        </CaseSection>
        <CaseSection title="Next Steps">
          <ul className="space-y-3">
            <li>Introduce AI-assisted cuts for top-performing hooks to shorten iteration cycles.</li>
            <li>Codify onboarding playbooks for new editors to protect quality as headcount scales.</li>
            <li>Layer in benchmark dashboards so clients can self-serve performance context between syncs.</li>
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
