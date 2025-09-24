'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-5xl px-2 py-16 sm:px-4"
    >
      <div className="flex flex-col gap-12">{children}</div>
    </motion.div>
  );
}
