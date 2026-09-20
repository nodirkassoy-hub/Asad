"use client";

import { useApp } from "@/context/AppContext";
import { Logo } from "./ui";

const LINKS = [
  { key: "nav.home", href: "#home" },
  { key: "nav.products", href: "#products" },
  { key: "nav.production", href: "#production" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.about", href: "#about" },
  { key: "nav.contact", href: "#contact" },
] as const;

export default function Footer() {
  const { t } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-[var(--glass-border)]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(34,211,238,0.10), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-c">{t("footer.desc")}</p>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-muted-c">
              {t("footer.nav")}
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm font-semibold text-muted-c transition-colors hover:text-cyan-600 dark:hover:text-cyan-300"
                  >
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-muted-c">
              {t("footer.contact")}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="tel:+998995132222" className="group flex items-center gap-3 text-sm font-bold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] text-cyan-500 transition-colors group-hover:border-cyan-400/50 dark:text-cyan-300">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  +998 99 513 22 22
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/penaplast_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm font-bold"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] text-cyan-500 transition-colors group-hover:border-cyan-400/50 dark:text-cyan-300">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M21.9 4.6c.3-1.2-.9-2.2-2-1.7L2.7 9.6c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.4c.4 1.1 1.8 1.4 2.6.5l2.4-2.5 4.5 3.3c1 .7 2.3.2 2.6-1L21.9 4.6zM9.5 13.2l8.6-5.4c.4-.2.8.3.5.6l-7 6.4-.3 3-1.8-4.6z" />
                    </svg>
                  </span>
                  @penaplast_uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--glass-border)] pt-6 sm:flex-row">
          <div className="text-center text-xs font-semibold text-muted-c sm:text-left">
            IZO PLUS · PENAPLAST ZAVODI
          </div>
          <div className="text-xs font-semibold text-muted-c">
            © {year} {t("footer.rights")}
          </div>
        </div>
      </div>
    </footer>
  );
}
