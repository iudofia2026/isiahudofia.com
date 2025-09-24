'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={prefersReducedMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/50 bg-surface/80 p-6 shadow-subtle backdrop-blur"
    >
      <div className="relative overflow-hidden rounded-[1.35rem] bg-muted/60">
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          width={640}
          height={420}
          className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">{project.title}</h3>
          <p className="mt-2 text-sm text-foreground/60">{project.tagline}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 text-foreground/40 transition group-hover:text-accent" aria-hidden />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground/60"
          >
            {chip}
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
