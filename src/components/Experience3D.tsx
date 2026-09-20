"use client";

import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { SectionHeading } from "./ui";

const EpsScene = dynamic(() => import("./three/EpsScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-cyan-400/60" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-muted-c">3D</span>
      </div>
    </div>
  ),
});

export default function Experience3D() {
  const { t } = useApp();

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-96 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(34,211,238,0.08),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading kicker={t("exp.kicker")} title={t("exp.title")} sub={t("exp.sub")} />

        <div className="glass-card relative overflow-hidden">
          {/* canvas */}
          <div
            className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]"
            style={{
              background:
                "radial-gradient(ellipse 80% 90% at 50% 30%, rgba(14,32,64,0.55), rgba(4,7,13,0.9))",
            }}
          >
            <div className="absolute inset-0 z-10">
              <EpsScene labelBlock={t("exp.label.block")} labelBeads={t("exp.label.beads")} />
            </div>

            {/* hints */}
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
              <span className="glass flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-c sm:text-[11px]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-500 dark:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <span className="hint-desktop">{t("exp.hint.desktop")}</span>
                <span className="hint-touch">{t("exp.hint.touch")}</span>
              </span>
            </div>
          </div>

          {/* spec strip */}
          <div className="grid grid-cols-3 divide-x divide-[var(--glass-border)] border-t border-[var(--glass-border)]">
            {(
              [
                ["exp.spec.density", "exp.spec.density.v"],
                ["exp.spec.thickness", "exp.spec.thickness.v"],
                ["exp.spec.size", "exp.spec.size.v"],
              ] as const
            ).map(([k, v], i) => (
              <div key={k} className={`px-3 py-4 text-center sm:px-6 sm:py-5 ${i === 1 ? "bg-cyan-400/[0.04]" : ""}`}>
                <div className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-muted-c sm:text-[10px]">
                  {t(k)}
                </div>
                <div className="mt-1 text-xs font-black tracking-tight text-cyan-600 sm:text-base dark:text-cyan-300">
                  {t(v)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
