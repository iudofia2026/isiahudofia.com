"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Minimal, GPU-friendly animated background:
 * - Two softly blurred gradient "orbs" drifting independently
 * - A faint vignette & grain overlay for depth
 * - Pointer parallax (very subtle) — disabled if reduced-motion
 * - Respects prefers-reduced-motion
 */
export default function HeroBg({
  className = "",
  intensity = 1,
}: { className?: string; intensity?: number }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 10 * intensity;
      const y = ((e.clientY / innerHeight) - 0.5) * 10 * intensity;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, intensity]);

  const style = useMemo(
    () => ({ transform: `translate3d(${reduced ? 0 : parallax.x}px, ${reduced ? 0 : parallax.y}px, 0)` }),
    [parallax, reduced]
  );

  return (
    <div className={`absolute inset-0 -z-20 overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 30%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div
        aria-hidden
        className="absolute -top-24 -left-20 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          ...style,
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.45), rgba(99,102,241,0.07) 60%, transparent 80%)",
          animation: reduced ? undefined : "floatXY 22s ease-in-out infinite",
        }}
      />

      <div
        aria-hidden
        className="absolute -bottom-32 -right-24 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          ...style,
          background:
            "radial-gradient(closest-side, rgba(147,51,234,0.35), rgba(147,51,234,0.06) 60%, transparent 80%)",
          animation: reduced ? undefined : "floatXY2 26s ease-in-out infinite",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.035) 60%, rgba(255,255,255,0) 100%)",
          mixBlendMode: "screen",
          animation: reduced ? undefined : "shimmer 12s linear infinite",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.2'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "auto",
        }}
      />
    </div>
  );
}
