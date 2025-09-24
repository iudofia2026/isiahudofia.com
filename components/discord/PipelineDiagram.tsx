"use client";

import type { ElementType } from "react";
import { memo } from "react";
import { Mic, AudioLines, Languages, MessageSquare, Monitor, BadgeCheck, ArrowRight } from "lucide-react";

type Node = { icon: ElementType; label: string };

const FIRST_ROW: Node[] = [
  { icon: Mic, label: "Discord Voice" },
  { icon: AudioLines, label: "Streaming STT (Deepgram)" },
  { icon: Languages, label: "Translation" },
  { icon: MessageSquare, label: "Inline Bot Messages" },
];

const OVERLAY_NODE: Node = { icon: Monitor, label: "Optional Overlay for Captions" };

function PipelineDiagram({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${className}`.trim()}
      aria-label="Translator pipeline"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-10"
        style={{
          background: "radial-gradient(120% 120% at 50% 0%, #7C3AED 0%, #A78BFA 45%, transparent 75%)",
        }}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {FIRST_ROW.map(({ icon: Icon, label }, index) => (
          <div
            key={label}
            className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
              <Icon aria-hidden className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-neutral-100">{label}</p>
            {index < FIRST_ROW.length - 1 && (
              <ArrowRight
                aria-hidden
                className="absolute -right-5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-purple-200 motion-safe:animate-pulse lg:block"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center lg:justify-start">
        <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
            <OVERLAY_NODE.icon aria-hidden className="h-5 w-5" />
            <BadgeCheck
              aria-hidden
              className="absolute -right-1 -top-1 h-3.5 w-3.5 text-emerald-300"
            />
          </div>
          <p className="text-sm font-medium text-neutral-100">{OVERLAY_NODE.label}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(PipelineDiagram);
