import { Cpu, Figma, Sparkles, Workflow, BarChart3 } from 'lucide-react';
import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

const lines = [
  'Yale cognitive science student building AI-first tools.',
  'Ships tight product loops across translation, creative ops, and research.',
  'Keeps decisions tied to real people, not decks.',
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
