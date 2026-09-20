"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ---------------- Scroll reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.65, 0.28, 0.99] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHeading({
  kicker,
  title,
  sub,
  center = true,
}: {
  kicker: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-14 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <Reveal>
        <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-500 dark:text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-gradient drop-shadow-[0_0_25px_rgba(34,211,238,0.25)]">{title}</span>
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.12}>
          <p className="mt-4 text-sm leading-relaxed text-muted-c sm:text-base">{sub}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ---------------- Logo ---------------- */

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className="group flex min-w-0 flex-col leading-none" aria-label="IZO PLUS — Penaplast Zavodi">
      <span
        className={`relative flex items-baseline gap-[0.32em] font-black tracking-tight transition-transform duration-300 group-hover:scale-[1.02] ${
          compact ? "text-lg" : "text-xl sm:text-[22px]"
        }`}
      >
        <span className="whitespace-nowrap text-slate-900 dark:text-white dark:[text-shadow:0_0_18px_rgba(34,211,238,0.35)]">
          IZO
        </span>
        <span className="relative whitespace-nowrap bg-gradient-to-r from-sky-600 via-cyan-500 to-cyan-400 bg-clip-text text-transparent dark:from-sky-400 dark:via-cyan-300 dark:to-cyan-400">
          PLUS
          <span className="absolute -bottom-[3px] left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 opacity-70" />
        </span>
      </span>
      <span
        className={`mt-[3px] font-bold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300/90 ${
          compact ? "text-[7px]" : "text-[8px] sm:text-[9px]"
        }`}
      >
        Penaplast Zavodi
      </span>
    </a>
  );
}
