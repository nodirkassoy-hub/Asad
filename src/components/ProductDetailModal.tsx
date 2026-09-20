"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useApp, useScrollLock } from "@/context/AppContext";
import {
  BLOCK_LENGTH,
  BLOCK_WIDTH,
  DENSITIES,
  MAX_THICKNESS,
  THICKNESSES,
  PRODUCT_MAP,
  unitPrice,
  formatMoney,
  formatUnit,
} from "@/data/products";

export default function ProductDetailModal() {
  const { t, tArr, detail, closeDetail, openOrder } = useApp();
  const reduce = useReducedMotion();
  const [density, setDensity] = useState(10);
  const [thickness, setThickness] = useState(5);

  useScrollLock(detail !== null);

  useEffect(() => {
    if (detail) {
      setDensity(detail.density);
      setThickness(Math.min(detail.thickness, MAX_THICKNESS));
    }
  }, [detail]);

  // esc to close
  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDetail();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, closeDetail]);

  const product = detail ? PRODUCT_MAP[detail.product] : null;

  return (
    <AnimatePresence>
      {detail && product && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
            onClick={closeDetail}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("detail.title")}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.21, 0.65, 0.28, 0.99] }}
            className="glass-strong relative flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl shadow-glow-lg sm:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-5 py-4 sm:px-7">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted-c sm:text-base">
                {t("detail.title")}
              </h3>
              <button
                onClick={closeDetail}
                className="glass flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:border-cyan-400/50"
                aria-label={t("common.close")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* scrollable body */}
            <div className="thin-scroll flex-1 overflow-y-auto">
              <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
                {/* visual */}
                <div className="relative h-60 sm:h-72 md:h-auto">
                  <img src={product.image} alt={t(product.nameKey)} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--glass)]/60 via-transparent to-transparent md:bg-gradient-to-r" />
                  <div
                    aria-hidden
                    className={`absolute -left-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br ${product.accent} blur-3xl`}
                  />
                </div>

                {/* info */}
                <div className="flex flex-col gap-5 p-5 sm:p-7">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{t(product.nameKey)}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-c">{t(product.descKey)}</p>
                  </div>

                  {/* density */}
                  {product.densityEnabled ? (
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                          {t("common.density")}
                        </span>
                        <span className="text-sm font-black text-cyan-600 dark:text-cyan-300">{density} kg/m³</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {DENSITIES.map((d) => (
                          <button
                            key={d}
                            onClick={() => setDensity(d)}
                            className={`rounded-xl px-2 py-2.5 text-sm font-bold transition-all ${
                              d === density
                                ? "bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_6px_18px_-6px_rgba(6,182,212,0.8)]"
                                : "border border-[var(--glass-border)] text-muted-c hover:border-cyan-400/50"
                            }`}
                            aria-pressed={d === density}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--glass-border)] px-4 py-3 text-sm font-semibold text-muted-c">
                      {t("product.crushed.priceNote")}
                    </div>
                  )}

                  {/* thickness */}
                  {product.thicknessEnabled ? (
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                          {t("common.thickness")}
                        </span>
                        <span className="text-sm font-black text-cyan-600 dark:text-cyan-300">{thickness} sm</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {THICKNESSES.map((th) => (
                          <button
                            key={th}
                            onClick={() => setThickness(th)}
                            className={`rounded-xl px-1 py-2.5 text-sm font-bold transition-all ${
                              th === thickness
                                ? "bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_6px_18px_-6px_rgba(6,182,212,0.8)]"
                                : "border border-[var(--glass-border)] text-muted-c hover:border-cyan-400/50"
                            }`}
                            aria-pressed={th === thickness}
                          >
                            {th}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-muted-c">
                        {t("detail.dims")}: {t("detail.dims.block").replace("{t}", String(thickness))} · {BLOCK_LENGTH} × {BLOCK_WIDTH} × {thickness}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-muted-c">{t("detail.dims.crushed")}</p>
                  )}

                  {/* summary */}
                  <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.06] p-4">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
                      {t("detail.summary")}
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div className="min-w-0 text-xs font-semibold leading-relaxed text-muted-c">
                        <div>
                          {product.densityEnabled ? `${density} kg/m³` : t("common.na")}
                          {" · "}
                          {product.thicknessEnabled ? `${thickness} sm` : t("common.na")}
                        </div>
                      </div>
                      <div className="whitespace-nowrap text-right">
                        <span className="text-2xl font-black tracking-tight sm:text-3xl">{formatMoney(unitPrice(product, density))}</span>
                        <span className="ml-1.5 text-xs font-bold text-muted-c">{formatUnit(product)}</span>
                      </div>
                    </div>
                  </div>

                  {/* tech + apps */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--glass-border)] p-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">{t("detail.tech")}</div>
                      <dl className="mt-3 space-y-2 text-xs">
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-c">{t("detail.tech.material")}</dt>
                          <dd className="text-right font-bold">{t("detail.tech.material.v")}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-c">{t("detail.tech.thermal")}</dt>
                          <dd className="text-right font-bold">{t("detail.tech.thermal.v")}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-c">{t("detail.tech.temp")}</dt>
                          <dd className="text-right font-bold">{t("detail.tech.temp.v")}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-muted-c">{t("detail.tech.moisture")}</dt>
                          <dd className="text-right font-bold">{t("detail.tech.moisture.v")}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="rounded-2xl border border-[var(--glass-border)] p-4">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">{t("detail.apps")}</div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tArr(product.appsKey).map((a) => (
                          <span key={a} className="chip cursor-default">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* footer CTA */}
            <div className="border-t border-[var(--glass-border)] p-4 sm:px-7">
              <button
                onClick={() => openOrder({ product: product.id, density, thickness })}
                className="btn-primary w-full py-4 text-sm"
              >
                {t("common.order")}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
