"use client";

import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Reveal, SectionHeading } from "./ui";

export default function About() {
  const { t, openOrder } = useApp();

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-sky-600/[0.06] blur-[110px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading kicker={t("about.kicker")} title={t("about.title")} center={false} />
            <Reveal delay={0.05}>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-c sm:text-base">{t("about.text1")}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-c sm:text-base">{t("about.text2")}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="tel:+998995132222" className="btn-ghost px-6 py-3.5 text-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-500 dark:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                  +998 99 513 22 22
                </a>
                <a href="https://t.me/penaplast_uz" target="_blank" rel="noopener noreferrer" className="btn-ghost px-6 py-3.5 text-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-500 dark:text-cyan-300" fill="currentColor">
                    <path d="M21.9 4.6c.3-1.2-.9-2.2-2-1.7L2.7 9.6c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.4c.4 1.1 1.8 1.4 2.6.5l2.4-2.5 4.5 3.3c1 .7 2.3.2 2.6-1L21.9 4.6zM9.5 13.2l8.6-5.4c.4-.2.8.3.5.6l-7 6.4-.3 3-1.8-4.6z" />
                  </svg>
                  @penaplast_uz
                </a>
                <button onClick={() => openOrder()} className="btn-primary px-6 py-3.5 text-sm">
                  {t("about.contact.cta")}
                </button>
              </div>
            </Reveal>
          </div>

          {/* contact glass panel */}
          <Reveal delay={0.15}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="glass-card relative overflow-hidden p-6 sm:p-8"
            >
              <div aria-hidden className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" />
              <h3 className="text-lg font-extrabold tracking-tight">{t("about.contact.title")}</h3>
              <div className="mt-6 space-y-3">
                <a
                  href="tel:+998995132222"
                  className="flex items-center gap-4 rounded-2xl border border-[var(--glass-border)] p-4 transition-colors hover:border-cyan-400/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                      {t("about.contact.phone")}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-bold">+998 99 513 22 22</span>
                  </span>
                </a>
                <a
                  href="https://t.me/penaplast_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-[var(--glass-border)] p-4 transition-colors hover:border-cyan-400/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M21.9 4.6c.3-1.2-.9-2.2-2-1.7L2.7 9.6c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.4c.4 1.1 1.8 1.4 2.6.5l2.4-2.5 4.5 3.3c1 .7 2.3.2 2.6-1L21.9 4.6zM9.5 13.2l8.6-5.4c.4-.2.8.3.5.6l-7 6.4-.3 3-1.8-4.6z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                      {t("about.contact.telegram")}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-bold">@penaplast_uz</span>
                  </span>
                </a>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
