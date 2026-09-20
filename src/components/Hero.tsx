"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useApp } from "@/context/AppContext";
import { DENSITIES, DENSITY_PRICES, formatMoney } from "@/data/products";

export default function Hero() {
  const { t, openOrder } = useApp();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const priceRows = DENSITIES.slice(0, 4);

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* background */}
      <motion.div style={reduce ? undefined : { y: yImg }} className="absolute inset-0">
        <img
          src="/images/hero-factory.jpg"
          alt=""
          aria-hidden
          className={`h-full w-full object-cover ${reduce ? "" : "animate-kenburns"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/75 to-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-ink-950/60" />
      </motion.div>

      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-sky-600/10 blur-[110px]" />
      <div aria-hidden className="grid-overlay absolute inset-0 opacity-60" />

      {/* content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:gap-14">
          <motion.div
            style={reduce ? undefined : { opacity }}
            initial={reduce ? false : { opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.21, 0.65, 0.28, 0.99] }}
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.3em] text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-cyan-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              {t("hero.kicker")}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-gradient drop-shadow-[0_0_35px_rgba(34,211,238,0.3)]">{t("hero.title1")}</span>
              <br />
              <span className="text-white [text-shadow:0_2px_30px_rgba(2,8,20,0.6)] dark:text-white">{t("hero.title2")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
              {t("hero.desc")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a href="#products" className="btn-primary px-7 py-4 text-[15px]">
                {t("hero.cta1")}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
              <button onClick={() => openOrder()} className="btn-ghost border-cyan-400/40 px-7 py-4 text-[15px]">
                {t("hero.cta2")}
              </button>
            </div>

            {/* stats */}
            <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass rounded-2xl px-3 py-3.5 text-center sm:px-4">
                  <div className="text-base font-extrabold text-cyan-600 sm:text-xl dark:text-cyan-300">
                    {t(`hero.stat${n}.v`)}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-c sm:text-[11px]">
                    {t(`hero.stat${n}.l`)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* glass price panel */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.21, 0.65, 0.28, 0.99] }}
            className="relative hidden lg:block"
          >
            <div aria-hidden className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-cyan-400/20 via-transparent to-sky-600/10 blur-xl" />
            <div className="glass-strong relative rounded-[28px] p-6 shadow-glow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-cyan-400">EPS</div>
                  <h3 className="mt-1 text-lg font-bold">{t("hero.prices.title")}</h3>
                </div>
                <span className="glass rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-c">
                  {t("hero.prices.note")}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {priceRows.map((d, i) => (
                  <motion.div
                    key={d}
                    initial={reduce ? false : { opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.09, duration: 0.5 }}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-colors hover:border-cyan-400/30"
                  >
                    <span className="text-sm font-semibold text-slate-300">
                      {d} <span className="text-xs font-medium text-muted-c">kg/m³</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      <span className="text-base font-extrabold tracking-tight">{formatMoney(DENSITY_PRICES[d])}</span>
                    </span>
                  </motion.div>
                ))}
              </div>

              <a
                href="#products"
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-300 transition-colors hover:bg-cyan-400/20"
              >
                {t("hero.prices.all")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#products"
        style={reduce ? undefined : { opacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-c sm:flex"
        aria-label={t("hero.scroll")}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            animate={reduce ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-cyan-400"
          />
        </span>
      </motion.a>
    </section>
  );
}
