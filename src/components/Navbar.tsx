"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useApp, useScrollLock } from "@/context/AppContext";
import { LANGS } from "@/data/i18n";
import { Logo } from "./ui";

const NAV_ITEMS = [
  { key: "nav.home", href: "#home" },
  { key: "nav.products", href: "#products" },
  { key: "nav.production", href: "#production" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.about", href: "#about" },
  { key: "nav.contact", href: "#contact" },
] as const;

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SearchIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const current = LANGS.find((l) => l.id === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold tracking-widest transition-colors hover:border-cyan-400/50"
        aria-label="Language"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-500 dark:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
        </svg>
        {current.short}
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="glass-strong absolute right-0 top-[calc(100%+8px)] z-50 w-40 overflow-hidden rounded-2xl p-1.5 shadow-card"
          >
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  l.id === lang ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300" : "hover:bg-white/5 dark:hover:bg-white/5"
                }`}
              >
                {l.label}
                {l.id === lang && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { t, theme, toggleTheme, openOrder, openSearch } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  useScrollLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          className={`glass-strong mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 transition-all duration-300 sm:px-5 ${
            scrolled ? "h-[58px] shadow-card" : "h-[70px] sm:h-[76px]"
          }`}
        >
          <div className="min-w-0">
            <Logo compact={scrolled} />
          </div>

          {/* desktop links */}
          <div className="hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-[13px] font-semibold tracking-wide text-muted-c transition-colors hover:text-cyan-600 dark:hover:text-cyan-300"
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          {/* right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="glass hidden h-10 w-10 items-center justify-center rounded-xl text-muted-c transition-colors hover:border-cyan-400/50 hover:text-cyan-600 dark:hover:text-cyan-300 sm:flex"
              aria-label={t("common.search")}
            >
              <SearchIcon />
            </button>

            <div className="hidden sm:block">
              <LangSwitcher />
            </div>

            <button
              onClick={toggleTheme}
              className="glass hidden h-10 w-10 items-center justify-center rounded-xl text-muted-c transition-colors hover:border-cyan-400/50 hover:text-cyan-600 dark:hover:text-cyan-300 sm:flex"
              aria-label={theme === "dark" ? t("common.themeLight") : t("common.themeDark")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={() => openOrder()}
              className="btn-primary hidden h-10 px-4 text-[13px] md:inline-flex"
            >
              {t("nav.order")}
            </button>

            {/* mobile: search + hamburger */}
            <button
              onClick={openSearch}
              className="glass flex h-10 w-10 items-center justify-center rounded-xl text-muted-c sm:hidden"
              aria-label={t("common.search")}
            >
              <SearchIcon />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="glass flex h-10 w-10 items-center justify-center rounded-xl xl:hidden"
              aria-label={t("common.menu")}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="glass-strong absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col rounded-l-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="glass flex h-10 w-10 items-center justify-center rounded-xl"
                  aria-label={t("common.close")}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-1.5">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                    className="rounded-2xl px-4 py-3.5 text-[15px] font-semibold tracking-wide transition-colors hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-300"
                  >
                    {t(item.key)}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-6">
                <div className="flex items-center gap-2">
                  <LangSwitcher />
                  <button
                    onClick={toggleTheme}
                    className="glass flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold tracking-widest"
                  >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    {theme === "dark" ? t("common.themeLight") : t("common.themeDark")}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openOrder();
                  }}
                  className="btn-primary w-full py-4 text-sm"
                >
                  {t("nav.order")}
                </button>
                <a
                  href="tel:+998995132222"
                  className="btn-ghost w-full py-4 text-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-500 dark:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                  +998 99 513 22 22
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
