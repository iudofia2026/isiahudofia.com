import { Cpu, Figma, Sparkles, Workflow, BarChart3 } from 'lucide-react';
import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

const lines = [
  'Senior B.S. in Cognitive Science at Yale',
  'I’m interested in product management and how technical ideas become usable products. Alongside my coursework, I’ve been “vibe coding” projects like a live Discord voice translator, building skills in design, front-end development, and AI integration.',
  'Outside of coding, I run a video editing agency that works with creators and brands, managing editors and helping clients grow through stronger storytelling.',
  'For my senior thesis, I’m analyzing wearable sleep data with machine learning, linking physiology to subjective experience. I see it as a way to connect the product-building mindset I’ve developed in my side projects and agency work with academic research that impacts real people.',
];

const tools = [
  { icon: Sparkles, label: 'Framer' },
  { icon: Figma, label: 'Figma' },
  { icon: Workflow, label: 'Linear' },
  { icon: BarChart3, label: 'Mode' },
  { icon: Cpu, label: 'Python' },
];

export default function AboutPage() {
  return (
    <>
      <RouteSeo title="About" />
      <Section eyebrow="Profile" title="Isiah Udofia">
        <div className="space-y-3 text-lg text-foreground/70">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {tools.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-foreground/70"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
