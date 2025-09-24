"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { LogoBadge } from "./logo-badge";

type Props = { p?: Project; project?: Project };

export function ProjectCard({ p, project }: Props) {
  const item = p ?? project;

  if (!item) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[ProjectCard] Missing prop: pass either { p } or { project }");
    }
    return null;
  }

  const from = item.gradient?.from ?? "#3B82F6";
  const to = item.gradient?.to ?? "#8B5CF6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <Link
        href={`/projects/${item.slug}`}
        className="group block rounded-3xl border border-neutral-900 bg-neutral-950/60 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] transition will-change-transform hover:-translate-y-0.5 hover:border-neutral-700"
      >
        <LogoBadge src={item.logo} alt={item.title} from={from} to={to} />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-1 text-sm text-neutral-400">{item.tagline}</p>
          </div>
          <ArrowUpRight className="opacity-0 transition group-hover:opacity-100" />
        </div>

        {Array.isArray(item.metrics) && item.metrics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-300">
            {item.metrics.map((m) => (
              <span key={m.label} className="rounded-full border border-neutral-800/80 px-2 py-0.5">
                {m.label.toUpperCase()} {m.value ? `· ${m.value}` : ""}
              </span>
            ))}
          </div>
        )}

        {Array.isArray(item.stack) && item.stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-400">
            {item.stack.slice(0, 5).map((s) => (
              <span key={s} className="rounded-full border border-neutral-800 px-2 py-0.5">
                {s}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default ProjectCard;
