"use client";

import { Mic, Waveform, Languages, MessageSquare, MonitorCheck, ArrowRight } from "lucide-react";

const nodes = [
  { label: "Discord Voice", icon: Mic },
  { label: "Streaming STT (Deepgram)", icon: Waveform },
  { label: "Translation", icon: Languages },
  { label: "Inline Bot Messages", icon: MessageSquare },
];

const bottomNode = { label: "Optional Overlay for Captions", icon: MonitorCheck };

export default function PipelineDiagram({ className }: { className?: string }) {
  const containerClass = `relative rounded-3xl border border-[rgba(140,148,255,0.25)] bg-neutral-950/70 p-6 shadow-[0_20px_80px_-40px_rgba(124,58,237,0.6)] ${
    className ?? ""
  }`;
  return (
    <section className={containerClass.trim()}>
      <h2 className="sr-only">Translator pipeline</h2>
      <div className="grid gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div key={node.label} className="relative flex flex-1 items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="text-sm font-medium text-neutral-100">{node.label}</p>
                </div>
                {index < nodes.length - 1 && <Arrow className="hidden lg:block" />}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center lg:justify-start">
          <OverlayCard />
        </div>
      </div>
    </section>
  );
}

function OverlayCard() {
  const Icon = bottomNode.icon;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="text-sm font-medium text-neutral-100">{bottomNode.label}</p>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  const classes = `relative h-px flex-1 overflow-hidden ${className ?? ""}`.trim();
  return (
    <div className={classes}>
      <div
        className="motion-safe:animate-[dash_2s_linear_infinite] absolute inset-0"
        style={{ borderBottom: "1px dashed rgba(167,139,250,0.6)" }}
      />
      <ArrowRight
        className="absolute -right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(167,139,250,0.9)]"
        aria-hidden
      />
      <style>{`
        @keyframes dash {
          from { transform: translateX(0); }
          to { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
