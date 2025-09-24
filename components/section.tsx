'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function Section({
  title,
  eyebrow,
  children,
  accent,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  accent?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-6xl px-2 py-12 sm:px-4 sm:py-16"
    >
      {eyebrow && (
        <p className={`text-xs uppercase tracking-[0.3em] text-accent/80 ${accent ?? ''}`}>
          {eyebrow}
        </p>
      )}
      {title && <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h2>}
      <div className="mt-10 flex flex-col gap-10 text-foreground/80">{children}</div>
    </motion.section>
  );
}
