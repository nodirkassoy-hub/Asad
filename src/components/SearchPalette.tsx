"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useApp, useScrollLock } from "@/context/AppContext";
import { PRODUCT_MAP } from "@/data/products";
import { searchProducts, type SearchRow } from "@/lib/search";

function Row({ row, onOrder }: { row: SearchRow; onOrder: (r: SearchRow) => void }) {
  const { t } = useApp();
  const p = PRODUCT_MAP[row.productId];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] p-2 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.05] sm:gap-4 sm:p-2.5">
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-20">
        <img src={p.image} alt={t(p.nameKey)} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold sm:text-[15px]">{t(p.nameKey)}</div>
        <div className="mt-0.5 truncate text-xs font-semibold text-muted-c">
          {p.densityEnabled && row.density > 0 && (
            <span>
              {row.density} kg/m³{row.thickness > 0 ? " · " : ""}
            </span>
          )}
          {p.thicknessEnabled && row.thickness > 0 && <span>{row.thickness} sm</span>}
          {!p.densityEnabled && !p.thicknessEnabled && (
            <span>
              {row.priceLabel}
            </span>
          )}
        </div>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <div className="text-sm font-black tracking-tight">{row.priceLabel.split(" ")[0]}</div>
        <div className="text-[10px] font-bold text-muted-c">{row.priceLabel.split(" ").slice(1).join(" ")}</div>
      </div>
      <button
        onClick={() => onOrder(row)}
        className="btn-primary shrink-0 px-3 py-2.5 text-xs sm:px-4"
      >
        {t("common.order")}
      </button>
    </div>
  );
}

export default function SearchPalette() {
  const { t, searchOpen, closeSearch, openOrder, openSearch } = useApp();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useScrollLock(searchOpen);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      const id = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
      if (e.key === "Escape" && searchOpen) closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch, openSearch]);

  const rows = useMemo(() => searchProducts(query), [query]);
  const trimmed = query.trim().length > 0;

  const onOrder = (r: SearchRow) => {
    openOrder({ product: r.productId, density: r.density || undefined, thickness: r.thickness || undefined });
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[10vh] sm:pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
            onClick={closeSearch}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("search.title")}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.21, 0.65, 0.28, 0.99] }}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-3xl shadow-glow-lg"
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-[var(--glass-border)] px-4 py-4 sm:px-5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-cyan-500 dark:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-c/70 sm:text-base"
                aria-label={t("search.title")}
              />
              <span className="hidden rounded-lg border border-[var(--glass-border)] px-2 py-1 text-[10px] font-bold tracking-widest text-muted-c sm:block">
                {t("search.hint")}
              </span>
              <button
                onClick={closeSearch}
                className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                aria-label={t("common.close")}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* results */}
            <div className="thin-scroll max-h-[52vh] space-y-2 overflow-y-auto p-3 sm:p-4">
              {trimmed && rows.length > 0 && (
                <div className="px-1 pb-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                  {rows.length} {t("search.results")}
                </div>
              )}
              {rows.length > 0 ? (
                <>
                  {rows.map((r) => (
                    <Row key={r.key} row={r} onOrder={onOrder} />
                  ))}
                  {!trimmed && (
                    <a
                      href="#products"
                      onClick={closeSearch}
                      className="block rounded-2xl px-3 py-2.5 text-center text-sm font-bold text-cyan-600 hover:bg-cyan-400/10 dark:text-cyan-300"
                    >
                      {t("search.showAll")}
                    </a>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-500 dark:text-cyan-300">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5M8 11h6" />
                    </svg>
                  </div>
                  <p className="text-sm font-extrabold tracking-wide">{t("search.empty")}</p>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-c">{t("search.emptyHint")}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
