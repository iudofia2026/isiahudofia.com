"use client";

import { motion } from "framer-motion";

export type TimelineStep = { title: string; body: string };

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  return (
    <div className="relative lg:flex lg:gap-10">
      <div className="sticky top-24 hidden h-full w-px bg-gradient-to-b from-purple-500/40 via-purple-500/20 to-transparent lg:block" />
      <ul className="space-y-6 lg:flex-1">
        {steps.map((step) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="relative rounded-2xl border border-white/8 bg-white/5 p-5 shadow-[0_8px_30px_-18px_rgba(124,58,237,0.65)]"
          >
            <div className="absolute -left-4 top-5 hidden h-2 w-2 rounded-full bg-purple-400 lg:block" aria-hidden />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-200">{step.body}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
