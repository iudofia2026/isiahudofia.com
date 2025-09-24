"use client";

import { motion } from "framer-motion";

export type TimelineStep = { title: string; body: string };

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  const items = Array.isArray(steps) ? steps : [];
  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute left-3 top-0 h-full w-px bg-neutral-800 md:left-4" aria-hidden />
      <ol className="space-y-6">
        {items.map((step, index) => (
          <li key={step.title} className="relative pl-10">
            <div
              className="absolute left-3 top-2 h-2.5 w-2.5 -translate-x-1 rounded-full border border-neutral-400 bg-neutral-100 md:left-4"
              aria-hidden
            />
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="text-sm font-semibold tracking-wide text-neutral-100"
            >
              {step.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
              transition={{ duration: 0.3, delay: index * 0.04 + 0.05 }}
              className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-400"
            >
              {step.body}
            </motion.p>
          </li>
        ))}
      </ol>
    </div>
  );
}
