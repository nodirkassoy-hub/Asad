"use client";

import type { ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import { Reveal, SectionHeading } from "./ui";

interface ContactCard {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  cta?: string;
  icon: ReactNode;
}

export default function Contact() {
  const { t } = useApp();

  const cards: ContactCard[] = [
    {
      label: t("contact.phone"),
      value: "+998 99 513 22 22",
      href: "tel:+998995132222",
      cta: t("contact.call"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
        </svg>
      ),
    },
    {
      label: t("contact.telegram"),
      value: "@penaplast_uz",
      href: "https://t.me/penaplast_uz",
      external: true,
      cta: t("contact.write"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M21.9 4.6c.3-1.2-.9-2.2-2-1.7L2.7 9.6c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.4c.4 1.1 1.8 1.4 2.6.5l2.4-2.5 4.5 3.3c1 .7 2.3.2 2.6-1L21.9 4.6zM9.5 13.2l8.6-5.4c.4-.2.8.3.5.6l-7 6.4-.3 3-1.8-4.6z" />
        </svg>
      ),
    },
    {
      label: t("contact.email"),
      value: "info@izoplus.uz",
      href: "mailto:info@izoplus.uz",
      cta: t("contact.write"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
    {
      label: t("contact.address"),
      value: t("contact.address.value"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <SectionHeading kicker={t("contact.kicker")} title={t("contact.title")} sub={t("contact.sub")} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* contact cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {cards.map((c, i) => {
            const inner = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-600 transition-transform duration-300 group-hover:scale-110 dark:text-cyan-300">
                  {c.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">{c.label}</span>
                  <span className="mt-0.5 block truncate text-sm font-bold">{c.value}</span>
                </span>
                {c.href ? (
                  <span className="shrink-0 rounded-full border border-cyan-400/30 px-3 py-1.5 text-[11px] font-bold text-cyan-600 transition-colors group-hover:bg-cyan-400/10 dark:text-cyan-300">
                    {c.cta}
                  </span>
                ) : null}
              </>
            );
            const cls = "glass-card group flex w-full items-center gap-3.5 p-4 transition-colors hover:border-cyan-400/40 sm:gap-4 sm:p-5";
            return (
              <Reveal key={c.label} delay={i * 0.06}>
                {c.href ? (
                  <a href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        {/* map placeholder */}
        <Reveal delay={0.15}>
          <div className="glass-card relative flex h-full min-h-[320px] flex-col overflow-hidden p-0">
            {/* stylized map grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(34,211,238,0.10), transparent 70%)",
              }}
            />
            {/* fake roads */}
            <div aria-hidden className="absolute left-0 right-0 top-1/3 h-px -rotate-3 bg-cyan-400/20" />
            <div aria-hidden className="absolute bottom-0 top-0 left-1/2 w-px rotate-6 bg-cyan-400/15" />

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-5">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-cyan-400/50" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 shadow-glow">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-cyan-400" fill="currentColor">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                </span>
              </div>
              <div className="text-sm font-extrabold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">
                {t("contact.map.pin")}
              </div>
              <h3 className="mt-2 text-lg font-black">{t("contact.map.title")}</h3>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-c">{t("contact.map.note")}</p>
              <p className="mt-4 text-xs font-bold text-muted-c">{t("contact.address.value")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
