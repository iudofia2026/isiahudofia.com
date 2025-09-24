"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LogoBadge({
  src,
  alt,
  from = "#3B82F6",
  to = "#8B5CF6",
}: { src: string; alt: string; from?: string; to?: string }) {
  return (
    <div className="relative">
      {/* Glow ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-70"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, ${from}33 0%, ${to}22 30%, transparent 60%)`,
          filter: "blur(14px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="aspect-square w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 shadow-inner"
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={false}
            sizes="(min-width:1024px) 320px, 100vw"
            className="object-contain p-6"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default LogoBadge;
