"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type Step = { title: string; body: string };

export default function AnimatedTimeline({ steps }: { steps: Step[] }) {
  const items = Array.isArray(steps) ? steps : [];
  if (items.length === 0) return null;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 15%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-3 top-0 h-full w-px bg-neutral-800 md:left-4" aria-hidden />
      <motion.div
        style={{ height }}
        className="absolute left-3 top-0 w-px bg-gradient-to-b from-cyan-400/80 to-sky-400/70 md:left-4 motion-safe:opacity-100"
        aria-hidden
      />
      <ol className="space-y-5">
        {items.map((s, i) => (
          <li key={s.title} className="relative pl-10">
            <motion.span
              aria-hidden
              className="absolute left-3 top-2 h-2.5 w-2.5 -translate-x-1 rounded-full border border-neutral-400 bg-neutral-100 md:left-4"
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
              transition={{ duration: 0.22, delay: i * 0.04 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
              transition={{ duration: 0.26, delay: i * 0.05 }}
              className="rounded-xl border border-neutral-900 bg-neutral-950/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <h4 className="text-sm font-semibold text-neutral-200">{s.title}</h4>
              <p className="mt-1 text-sm text-neutral-400">{s.body}</p>
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}
