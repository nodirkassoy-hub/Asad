"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Reveal, SectionHeading } from "./ui";

const ITEMS = [
  { n: 1, image: "/images/app-uy.jpg", span: "md:col-span-2" },
  { n: 2, image: "/images/app-binolar.jpg", span: "" },
  { n: 3, image: "/images/app-devor.jpg", span: "" },
  { n: 4, image: "/images/app-tom.jpg", span: "" },
  { n: 5, image: "/images/app-pol.jpg", span: "" },
  { n: 6, image: "/images/app-sovutish.jpg", span: "" },
  { n: 7, image: "/images/app-qadoqlash.jpg", span: "md:col-span-2" },
] as const;

function AppIcon({ n, className }: { n: number; className?: string }) {
  const cls = className ?? "h-12 w-12";
  switch (n) {
    case 1:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 9-8 9 8" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="10" height="18" rx="1" />
          <rect x="14" y="9" width="6" height="12" rx="1" />
          <path d="M7 7h1.5M9.5 7H11M7 11h1.5M9.5 11H11M7 15h1.5M9.5 15H11M16 12.5h1.5M16 16h1.5" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6.5 9.7v4.6M12 9.7v4.6M17.5 9.7v4.6M9 14.3V19M15 14.3V19" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 13 10-9 10 9" />
          <path d="M6 12v8h12v-8" />
          <path d="M9 20v-5h6v5" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h18M3 13h18M3 18h18" />
          <path d="M3 8l2 2M9 8l2 2M15 8l2 2M3 13l2 2M9 13l2 2M15 13l2 2M3 18l2 2M9 18l2 2M15 18l2 2" opacity="0.6" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M4.5 5.5 19.5 18.5M19.5 5.5 4.5 18.5" />
          <path d="M12 6 9.5 3.8M12 6l2.5-2.2M12 18l-2.5 2.2M12 18l2.5 2.2" opacity="0.7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="M3 8l9 5 9-5M12 13v8" />
        </svg>
      );
  }
}

function AppTile({ item, index }: { item: (typeof ITEMS)[number]; index: number }) {
  const { t } = useApp();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Reveal delay={index * 0.05} className={item.span}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group relative h-full min-h-[210px] overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-ink-800"
      >
        {imgFailed ? (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 30% 20%, rgba(34,211,238,0.16), transparent 60%), linear-gradient(150deg, #0a1120 10%, #04070d 90%)",
            }}
          />
        ) : (
          <img
            src={item.image}
            alt={t(`use.${item.n}.t`)}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent ${
            imgFailed ? "opacity-60" : ""
          }`}
        />
        {imgFailed && (
          <div aria-hidden className="absolute right-4 top-4 text-cyan-400/40 transition-colors duration-300 group-hover:text-cyan-400/80">
            <AppIcon n={item.n} className="h-14 w-14" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-cyan-300">
            {String(item.n).padStart(2, "0")}
          </div>
          <h3 className="mt-1 text-base font-extrabold tracking-tight text-white sm:text-lg">
            {t(`use.${item.n}.t`)}
          </h3>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-300 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:opacity-90 sm:text-[13px]">
            {t(`use.${item.n}.d`)}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

export default function Applications() {
  const { t } = useApp();

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <SectionHeading kicker={t("use.kicker")} title={t("use.title")} sub={t("use.sub")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-5">
        {ITEMS.map((item, i) => (
          <AppTile key={item.n} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
