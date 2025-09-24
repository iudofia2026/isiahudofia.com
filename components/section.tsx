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
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-5xl"
    >
      {eyebrow && (
        <p className={`text-sm uppercase tracking-[0.2em] text-accent/80 ${accent ?? ''}`}>
          {eyebrow}
        </p>
      )}
      {title && <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>}
      <div className="mt-6 space-y-6 text-foreground/80">{children}</div>
    </motion.section>
  );
}
