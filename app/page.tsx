import Link from 'next/link';
import Script from 'next/script';
import Section from '../components/section';
import ProjectCard from '../components/project-card';
import RouteSeo from '../components/route-seo';
import { projects } from '../data/projects';

const featured = projects;

export default function HomePage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Isiah Udofia',
    jobTitle: 'Product Strategist & Builder',
    telephone: '+1-973-303-6883',
    url: 'https://www.isiahudofia.com',
    sameAs: [
      'https://github.com/iudofia2026',
      'https://www.linkedin.com/in/REPLACE_WITH_YOUR_SLUG',
    ],
  };

  return (
    <>
      <RouteSeo
        title="Product-Minded Builder"
        description="Isiah Udofia turns ambiguous product spaces into measurable outcomes across AI, growth, and research-driven bets."
      />
      <Script id="person-schema" type="application/ld+json">
        {JSON.stringify(personSchema)}
      </Script>
      <Section eyebrow="Product Strategy" title="Shipping clarity when the brief is fuzzy.">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-end">
          <div className="space-y-5 text-lg text-foreground/80">
            <p>
              I blend cognitive science rigor with scrappy GTM instincts to scope, ship, and scale
              AI-enabled experiences. From live translation inside Discord to retained creative ops,
              I lead with customer discovery and land with metrics.
            </p>
            <p>
              Whether the brief is a blank Notion doc or a tangled roadmap, I uncover the job to be done,
              prototype fast, and earn trust with transparent storytelling.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start a conversation
              </Link>
              <Link
                href="tel:+19733036883"
                className="rounded-full border border-border/70 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Call 973-303-6883
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-surface/60 p-6 text-sm text-foreground/70 shadow-subtle">
            <p className="font-medium text-foreground">What product peers say</p>
            <p className="mt-3 leading-relaxed">
              “Isiah brings frameworks without the jargon and prototypes without the ego. He translates
              ambiguous insights into crisp narratives that help teams decide.”
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.32em] text-accent/70">Signals</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Discovery sprints grounded in JTBD interviews</li>
              <li>PRDs that tie metrics, UX, and platform debt together</li>
              <li>Launch ops with tight feedback loops</li>
            </ul>
          </div>
        </div>
      </Section>
      <Section eyebrow="Featured Work" title="Problem → Approach → Result">
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
      <Section eyebrow="Capabilities" title="Where I add leverage.">
        <div className="grid gap-6 md:grid-cols-2">
          <CapabilityCard
            title="Zero-to-one product discovery"
            bullets={[
              'Customer interviews + JTBD mapping',
              'Opportunity sizing & metric modeling',
              'Figma/Framer prototypes that test causality',
            ]}
          />
          <CapabilityCard
            title="Operationalizing delivery"
            bullets={[
              'Cross-functional rituals & dashboards',
              'Experiment design and instrumentation',
              'Narratives that align execs and ICs',
            ]}
          />
        </div>
      </Section>
    </>
  );
}

type CapabilityCardProps = {
  title: string;
  bullets: string[];
};

function CapabilityCard({ title, bullets }: CapabilityCardProps) {
  return (
    <div className="h-full rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-subtle backdrop-blur">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-foreground/70">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
