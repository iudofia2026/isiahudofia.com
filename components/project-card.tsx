'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-subtle backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent/80">{project.tagline}</p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">{project.title}</h3>
          {project.dates && <p className="mt-1 text-sm text-foreground/60">{project.dates}</p>}
        </div>
        <ArrowUpRight className="h-5 w-5 text-foreground/30 transition group-hover:text-accent" aria-hidden />
      </div>
      <ul className="mt-4 space-y-2 text-sm text-foreground/70">
        {project.highlights.slice(0, 3).map((highlight) => (
          <li key={highlight} className="leading-relaxed">
            {highlight}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs uppercase tracking-wide text-foreground/60"
          >
            {tech}
          </span>
        ))}
      </div>
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0"
        aria-label={`View ${project.title} case study`}
      />
    </motion.article>
  );
}
