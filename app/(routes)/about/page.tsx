import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

export default function AboutPage() {
  return (
    <>
      <RouteSeo
        title="About"
        description="Cognitive science @ Yale, product-minded builder focused on AI, growth loops, and durable customer value."
      />
      <Section eyebrow="About" title="Cognitive science foundations. Product obsession.">
        <p className="text-lg text-foreground/75">
          I study Cognitive Science at Yale, where I focus on decision-making, sleep science, and human-AI interaction. I
          bring that lens into product work—balancing qualitative insight with quantitative rigor while keeping teams
          aligned on the job to be done.
        </p>
      </Section>
      <Section eyebrow="Operating Principles">
        <ul className="space-y-4 text-base text-foreground/75">
          <li>
            <strong>Ask better questions.</strong> Problem framing beats solution theater. I start with customer interviews
            and co-create JTBD narratives that orient design, eng, and GTM toward the same bet.
          </li>
          <li>
            <strong>Prototype the narrative.</strong> Prototypes aren&apos;t artifacts—they&apos;re arguments. I favor quick Framer or
            Figma explorations that test causal hypotheses, then translate learnings into crisp PRDs.
          </li>
          <li>
            <strong>Instrument the loop.</strong> Product, growth, and ops live together. I ensure experiments are measurable,
            instrumentation is trustworthy, and retros turn into system-level improvements.
          </li>
        </ul>
      </Section>
      <Section eyebrow="Stack" title="Tools I reach for.">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Product & Research" items={['JTBD interviews', 'Journey mapping', 'Experiment design', 'PRDs & narratives']} />
          <Card title="Design & Motion" items={['Figma', 'Framer', 'After Effects', 'Lottie']} />
          <Card title="Data & ML" items={['Python', 'Ridge/XGBoost', 'Causal inference', 'Looker/Mode']} />
          <Card title="Ops & Collaboration" items={['Notion', 'Linear', 'Airtable', 'Zapier automation']} />
        </div>
      </Section>
    </>
  );
}

type CardProps = {
  title: string;
  items: string[];
};

function Card({ title, items }: CardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-subtle backdrop-blur">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-foreground/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
