import { Github, Linkedin, Phone } from 'lucide-react';
import RouteSeo from '../../../components/route-seo';
import Section from '../../../components/section';

export default function ContactPage() {
  return (
    <>
      <RouteSeo title="Contact" />
      <Section eyebrow="Connect" title="Say hello">
        <div className="flex flex-col gap-5 text-sm text-foreground/70">
          <a
            href="mailto:isiah.udofia@yale.edu"
            className="inline-flex w-fit items-center gap-3 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Email isiah.udofia@yale.edu
          </a>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:+19733036883"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-foreground transition duration-300 hover:border-accent/70 hover:text-accent"
            >
              <Phone className="h-4 w-4" aria-hidden />
              973-303-6883
            </a>
            <a
              href="https://github.com/iudofia2026"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-foreground transition duration-300 hover:border-accent/70 hover:text-accent"
              target="_blank"
              rel="noopener"
            >
              <Github className="h-4 w-4" aria-hidden />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/isiah-udofia/"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-foreground transition duration-300 hover:border-accent/70 hover:text-accent"
              target="_blank"
              rel="noopener"
            >
              <Linkedin className="h-4 w-4" aria-hidden />
              LinkedIn
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
