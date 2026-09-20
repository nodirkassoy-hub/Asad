"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useApp, useScrollLock } from "@/context/AppContext";
import {
  DENSITIES,
  MAX_THICKNESS,
  PRODUCTS,
  THICKNESSES,
  unitPrice,
  formatMoney,
  formatUnit,
  type ProductId,
} from "@/data/products";
import { validateUzPhone } from "@/lib/search";

type Status = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  phone?: string;
  qty?: string;
}

export default function OrderModal() {
  const { t, orderOpen, orderPrefill, closeOrder } = useApp();
  const reduce = useReducedMotion();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState<ProductId>("oq");
  const [density, setDensity] = useState(10);
  const [thickness, setThickness] = useState(5);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  useScrollLock(orderOpen);

  // Prefill when opened
  useEffect(() => {
    if (orderOpen) {
      if (orderPrefill) {
        const p = PRODUCTS.find((x) => x.id === orderPrefill.product)!;
        setProduct(p.id);
        if (p.densityEnabled && orderPrefill.density) setDensity(orderPrefill.density);
        if (p.thicknessEnabled && orderPrefill.thickness)
          setThickness(Math.min(orderPrefill.thickness, MAX_THICKNESS));
      }
      setStatus("idle");
      setErrors({});
    }
  }, [orderOpen, orderPrefill]);

  useEffect(() => {
    if (!orderOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") closeOrder();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [orderOpen, status, closeOrder]);

  const productObj = PRODUCTS.find((p) => p.id === product)!;
  const unit = unitPrice(productObj, density);
  const qtyNum = parseFloat(qty.replace(",", ".").replace(/\./g, "."));
  const qtyValid = Number.isFinite(qtyNum) && qtyNum > 0;
  const total = qtyValid ? unit * qtyNum : null;

  const summary = useMemo(
    () => ({
      product: t(productObj.nameKey),
      density: productObj.densityEnabled ? `${density} kg/m³` : t("order.na"),
      thickness: productObj.thicknessEnabled ? `${thickness} sm` : t("order.na"),
      qty: qtyValid ? `${qtyNum} ${productObj.priceMode === "per_kg" ? "kg" : "m³"}` : t("common.na"),
      price: total !== null ? `${formatMoney(total)}` : t("common.na"),
    }),
    [t, productObj, density, thickness, qtyValid, qtyNum, total]
  );

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = t("order.err.required") as string;
    if (!validateUzPhone(phone)) e.phone = t("order.err.phone") as string;
    if (!qtyValid) e.qty = t("order.err.qty") as string;
    return e;
  };

  const submit = useCallback(async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          product: `${summary.product}`,
          density: summary.density,
          thickness: summary.thickness,
          quantity: summary.qty,
          price: `${summary.price} (${formatMoney(unit)} ${formatUnit(productObj)})`,
          note: note.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [name, phone, note, summary, unit, productObj]);

  return (
    <AnimatePresence>
      {orderOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-md"
            onClick={() => status !== "submitting" && closeOrder()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("order.title")}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.21, 0.65, 0.28, 0.99] }}
            className="glass-strong relative flex max-h-[94svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl shadow-glow-lg sm:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-5 py-4 sm:px-7">
              <div className="min-w-0">
                <h3 className="truncate text-base font-extrabold tracking-tight sm:text-lg">{t("order.title")}</h3>
                <p className="mt-0.5 hidden text-xs text-muted-c sm:block">{t("order.sub")}</p>
              </div>
              <button
                onClick={() => status !== "submitting" && closeOrder()}
                className="glass ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors hover:border-cyan-400/50"
                aria-label={t("common.close")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="thin-scroll flex-1 overflow-y-auto p-5 sm:p-7">
              {status === "success" ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <motion.div
                    initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20"
                  >
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-emerald-400/50" />
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h4 className="text-xl font-black">{t("order.success.title")}</h4>
                  <p className="mt-3 max-w-sm whitespace-pre-line text-sm leading-relaxed text-muted-c">
                    {t("order.success.text")}
                  </p>
                  <a
                    href="https://t.me/penaplast_uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 text-sm font-bold text-cyan-600 hover:underline dark:text-cyan-300"
                  >
                    {t("order.success.tg")}
                  </a>
                  <button onClick={closeOrder} className="btn-primary mt-8 w-full max-w-xs py-3.5 text-sm">
                    {t("common.close")}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* product pick */}
                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                      {t("order.product")} *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRODUCTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProduct(p.id)}
                          className={`relative overflow-hidden rounded-2xl border p-0 text-left transition-all ${
                            product === p.id
                              ? "border-cyan-400/70 shadow-[0_0_0_3px_rgba(34,211,238,0.18)]"
                              : "border-[var(--glass-border)] opacity-75 hover:opacity-100"
                          }`}
                          aria-pressed={product === p.id}
                        >
                          <div className="relative h-16 sm:h-20">
                            <img src={p.image} alt={t(p.nameKey)} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
                          </div>
                          <div className="px-2.5 py-2 text-[11px] font-bold leading-tight sm:text-xs">{t(p.nameKey)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* density */}
                  {productObj.densityEnabled ? (
                    <div>
                      <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                        {t("order.density")} *
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {DENSITIES.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDensity(d)}
                            className={`rounded-xl px-2 py-2.5 text-sm font-bold transition-all ${
                              d === density
                                ? "bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_6px_18px_-6px_rgba(6,182,212,0.8)]"
                                : "border border-[var(--glass-border)] text-muted-c hover:border-cyan-400/50"
                            }`}
                            aria-pressed={d === density}
                          >
                            {d}
                            <span className="ml-1 hidden text-[9px] font-semibold opacity-60 sm:inline">kg/m³</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--glass-border)] px-4 py-3 text-sm font-semibold text-muted-c">
                      {t("order.crushed.note")}
                    </div>
                  )}

                  {/* thickness */}
                  {productObj.thicknessEnabled ? (
                    <div>
                      <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                        {t("order.thickness")} *
                      </label>
                      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
                        {THICKNESSES.map((th) => (
                          <button
                            key={th}
                            type="button"
                            onClick={() => setThickness(th)}
                            className={`rounded-xl px-1 py-2.5 text-sm font-bold transition-all ${
                              th === thickness
                                ? "bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_6px_18px_-6px_rgba(6,182,212,0.8)]"
                                : "border border-[var(--glass-border)] text-muted-c hover:border-cyan-400/50"
                            }`}
                            aria-pressed={th === thickness}
                          >
                            {th}
                            <span className="ml-0.5 text-[9px] font-semibold opacity-60">sm</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* name / phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ord-name" className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                        {t("order.name")} *
                      </label>
                      <input
                        id="ord-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("order.name.ph")}
                        className={`field ${errors.name ? "field-error" : ""}`}
                        autoComplete="name"
                      />
                      {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="ord-phone" className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                        {t("order.phone")} *
                      </label>
                      <input
                        id="ord-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("order.phone.ph")}
                        className={`field ${errors.phone ? "field-error" : ""}`}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                      {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* qty / note */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ord-qty" className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                        {t("order.qty")} *{" "}
                        <span className="text-cyan-600 dark:text-cyan-300">
                          ({productObj.priceMode === "per_kg" ? t("order.kg") : t("order.m3")})
                        </span>
                      </label>
                      <input
                        id="ord-qty"
                        value={qty}
                        onChange={(e) => setQty(e.target.value.replace(/[^\d.,]/g, ""))}
                        placeholder="10"
                        className={`field ${errors.qty ? "field-error" : ""}`}
                        inputMode="decimal"
                      />
                      {errors.qty && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.qty}</p>}
                    </div>
                    <div>
                      <label htmlFor="ord-note" className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-c">
                        {t("order.note")}
                      </label>
                      <input
                        id="ord-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t("order.note.ph")}
                        className="field"
                      />
                    </div>
                  </div>

                  {/* summary */}
                  <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.06] p-4 sm:p-5">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
                      {t("order.summary")}
                    </div>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-c">{t("order.product")}</dt>
                        <dd className="text-right font-bold">{summary.product}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-c">{t("order.density")}</dt>
                        <dd className="text-right font-bold">{summary.density}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-c">{t("order.thickness")}</dt>
                        <dd className="text-right font-bold">{summary.thickness}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-c">{t("order.qty")}</dt>
                        <dd className="text-right font-bold">{summary.qty}</dd>
                      </div>
                      <div className="flex items-end justify-between gap-4 border-t border-cyan-400/20 pt-3">
                        <dt className="text-sm font-extrabold">{t("order.total")}</dt>
                        <dd className="text-right">
                          <span className="text-2xl font-black tracking-tight">{summary.price}</span>
                          <span className="mt-0.5 block text-[11px] font-semibold text-muted-c">
                            {t("order.unit")}: {formatMoney(unit)} {formatUnit(productObj)}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>

            {/* footer */}
            {status !== "success" && (
              <div className="border-t border-[var(--glass-border)] p-4 sm:px-7">
                {status === "error" && (
                  <div className="mb-3 flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-3.5">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-relaxed">{t("order.err.send")}</p>
                      <div className="mt-2.5 flex gap-2">
                        <button onClick={submit} className="btn-primary px-4 py-2 text-xs">
                          {t("order.err.retry")}
                        </button>
                        <a
                          href="https://t.me/penaplast_uz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost px-4 py-2 text-xs"
                        >
                          @penaplast_uz
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={submit}
                  disabled={status === "submitting"}
                  className="btn-primary w-full py-4 text-sm"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      {t("order.submitting")}
                    </>
                  ) : (
                    <>
                      {t("order.submit")}
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
