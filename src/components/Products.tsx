"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  DENSITIES,
  PRODUCTS,
  THICKNESSES,
  unitPrice,
  formatMoney,
  formatUnit,
  type Product,
  type ProductId,
} from "@/data/products";
import { Reveal, SectionHeading } from "./ui";

type Category = "all" | ProductId;

/* ---------------- thickness compact selector ---------------- */

function ThicknessSelect({
  value,
  onChange,
  onOpenChange,
}: {
  value: number;
  onChange: (v: number) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const { t } = useApp();
  const [open, setOpenRaw] = useState(false);
  const setOpen = (fn: boolean | ((o: boolean) => boolean)) => {
    setOpenRaw((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      onOpenChange?.(next);
      return next;
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--glass-border)] bg-transparent px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:border-cyan-400/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-300">{value}</span>
          <span className="text-xs font-medium text-muted-c">{t("filter.sm")}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-muted-c transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              role="listbox"
              className="glass-strong absolute right-0 left-0 z-20 mt-2 grid max-h-52 grid-cols-4 overflow-y-auto rounded-2xl p-2 shadow-card sm:grid-cols-6"
            >
              {THICKNESSES.map((th) => (
                <button
                  key={th}
                  type="button"
                  role="option"
                  aria-selected={th === value}
                  onClick={() => {
                    onChange(th);
                    setOpen(() => false);
                  }}
                  className={`rounded-xl px-2 py-2 text-xs font-bold transition-colors ${
                    th === value
                      ? "bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_4px_14px_-4px_rgba(6,182,212,0.8)]"
                      : "text-muted-c hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-300"
                  }`}
                >
                  {th}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- product card ---------------- */

function ProductCard({
  product,
  index,
  densityFilter,
}: {
  product: Product;
  index: number;
  densityFilter: number | null;
}) {
  const { t, openDetail, openOrder } = useApp();
  const [density, setDensity] = useState<number>(
    densityFilter && product.densityEnabled ? densityFilter : 10
  );
  const [thickness, setThickness] = useState<number>(5);
  const [thOpen, setThOpen] = useState(false);

  const price = unitPrice(product, density);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.21, 0.65, 0.28, 0.99] }}
      className={`group glass-card relative flex flex-col ${thOpen ? "z-30" : ""}`}
    >
      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
        <img
          src={product.image}
          alt={t(product.nameKey)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--glass)]/80 via-transparent to-transparent" />
        <div
          aria-hidden
          className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${product.accent} blur-2xl`}
        />
        <div className="glass-strong absolute bottom-3 left-3 flex items-baseline gap-1.5 rounded-2xl px-4 py-2.5 shadow-card">
          <span className="text-lg font-black tracking-tight sm:text-xl">{formatMoney(price)}</span>
          <span className="text-[11px] font-bold text-muted-c">{formatUnit(product)}</span>
        </div>
        <span className="glass absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
          EPS
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">{t(product.nameKey)}</h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-c">{t(product.descKey)}</p>
        </div>

        {product.densityEnabled ? (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-c">
                {t("common.density")}
              </span>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300">{density} kg/m³</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DENSITIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`chip min-w-[44px] ${d === density ? "chip-active" : ""}`}
                  aria-pressed={d === density}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--glass-border)] px-4 py-3 text-[13px] font-semibold text-muted-c">
            {t("product.crushed.priceNote")}
          </div>
        )}

        {product.thicknessEnabled ? (
          <div>
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-c">
              {t("common.thickness")}
            </div>
            <ThicknessSelect value={thickness} onChange={setThickness} onOpenChange={setThOpen} />
          </div>
        ) : null}

        {/* actions */}
        <div className="mt-auto flex gap-2.5 pt-1">
          <button
            onClick={() => openDetail({ product: product.id, density, thickness })}
            className="btn-ghost flex-1 py-3 text-[13px]"
          >
            {t("common.details")}
          </button>
          <button
            onClick={() => openOrder({ product: product.id, density, thickness })}
            className="btn-primary flex-1 py-3 text-[13px]"
          >
            {t("common.order")}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------------- section ---------------- */

export default function Products() {
  const { t } = useApp();
  const [category, setCategory] = useState<Category>("all");
  const [densityFilter, setDensityFilter] = useState<number | null>(null);
  const [thicknessFilter, setThicknessFilter] = useState<number | null>(null);

  const visible = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (category !== "all" && p.id !== category) return false;
      if (densityFilter && !p.densityEnabled) return false;
      if (thicknessFilter && !p.thicknessEnabled) return false;
      return true;
    });
  }, [category, densityFilter, thicknessFilter]);

  const hasFilters = category !== "all" || densityFilter !== null || thicknessFilter !== null;
  const reset = () => {
    setCategory("all");
    setDensityFilter(null);
    setThicknessFilter(null);
  };

  return (
    <section id="products" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[100px]" />

      <SectionHeading kicker={t("products.kicker")} title={t("products.title")} sub={t("products.sub")} />

      {/* filters */}
      <Reveal>
        <div className="glass-card mb-10 space-y-4 p-4 sm:p-5">
          {/* category */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
              {t("filter.category")}
            </span>
            {(["all", "oq", "qora", "crushed"] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`chip ${category === c ? "chip-active" : ""}`}
                aria-pressed={category === c}
              >
                {c === "all" ? t("filter.all") : t((PRODUCTS.find((p) => p.id === c) as Product).nameKey)}
              </button>
            ))}
          </div>

          <div className="h-px bg-[var(--glass-border)]" />

          {/* density */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
              {t("filter.density")}
            </span>
            {DENSITIES.map((d) => (
              <button
                key={d}
                onClick={() => setDensityFilter((cur) => (cur === d ? null : d))}
                className={`chip ${densityFilter === d ? "chip-active" : ""}`}
                aria-pressed={densityFilter === d}
              >
                {d}
                <span className="ml-1 opacity-60">kg/m³</span>
              </button>
            ))}
          </div>

          {/* thickness */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="mr-1 shrink-0 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
              {t("filter.thickness")}
            </span>
            {THICKNESSES.map((th) => (
              <button
                key={th}
                onClick={() => setThicknessFilter((cur) => (cur === th ? null : th))}
                className={`chip shrink-0 ${thicknessFilter === th ? "chip-active" : ""}`}
                aria-pressed={thicknessFilter === th}
              >
                {th} {t("filter.sm")}
              </button>
            ))}
          </div>

          {hasFilters && (
            <div className="flex justify-end">
              <button
                onClick={reset}
                className="text-xs font-bold text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-300"
              >
                ✕ {t("filter.reset")}
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {/* grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <ProductCard key={`${p.id}-${densityFilter ?? 0}`} product={p} index={i} densityFilter={densityFilter} />
          ))}
        </div>
      ) : (
        <div className="glass-card mx-auto max-w-md p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-500 dark:text-cyan-300">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5M8 11h6" />
            </svg>
          </div>
          <p className="text-base font-extrabold tracking-wide">{t("search.empty")}</p>
          <button onClick={reset} className="btn-ghost mt-5 px-6 py-2.5 text-sm">
            {t("filter.reset")}
          </button>
        </div>
      )}
    </section>
  );
}
