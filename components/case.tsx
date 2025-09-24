'use client';

import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

export default function CaseStudyLayout({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:grid lg:grid-cols-[280px,1fr] lg:items-start">
      <aside className="space-y-6 rounded-2xl border border-border/60 bg-surface/70 p-6 shadow-subtle backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-accent/80">Stack</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
        {project.metrics && project.metrics.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-accent/80">Metrics</p>
            <ul className="mt-3 space-y-3 text-sm text-foreground/80">
              {project.metrics.map((metric) => (
                <li key={metric.label} className="flex flex-col">
                  <span className="text-foreground">{metric.value}</span>
                  <span className="text-foreground/60">{metric.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {project.links && project.links.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-accent/80">Links</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="underline decoration-border/60 underline-offset-4 transition hover:text-accent"
                    target="_blank"
                    rel="noopener"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-10"
      >
        {children}
      </motion.article>
    </div>
  );
}
