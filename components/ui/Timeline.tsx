"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export type TimelineStep = { title: string; body: string };

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  const items = Array.isArray(steps) ? steps : [];
  if (items.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.2"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        aria-hidden
        className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-purple-500/60 via-purple-500/30 to-transparent md:left-4 lg:block"
        style={{
          transformOrigin: "top",
          scaleY: prefersReducedMotion ? 1 : progress,
        }}
      />
      <ol className="space-y-6">
        {items.map((step, index) => (
          <motion.li
            key={step.title}
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            whileInView={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5, margin: "-10% 0% -10% 0%" }}
            transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : index * 0.05 }}
            className="relative rounded-2xl border border-neutral-800/70 bg-neutral-900/50 px-5 py-4 shadow-[0_8px_30px_-20px_rgba(124,58,237,0.5)]"
          >
            <div
              className="absolute -left-4 top-5 hidden h-2.5 w-2.5 rounded-full border border-purple-300 bg-white/80 lg:block"
              aria-hidden
            />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-100">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">{step.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
