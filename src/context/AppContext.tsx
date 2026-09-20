"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getT, getTArray, type Lang, type TFunc } from "@/data/i18n";
import type { ProductId } from "@/data/products";

export interface OrderPrefill {
  product: ProductId;
  density?: number;
  thickness?: number;
}

interface DetailState {
  product: ProductId;
  density: number;
  thickness: number;
}

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunc;
  tArr: (key: string) => string[];
  theme: "dark" | "light";
  toggleTheme: () => void;
  detail: DetailState | null;
  openDetail: (d: DetailState) => void;
  closeDetail: () => void;
  orderOpen: boolean;
  orderPrefill: OrderPrefill | null;
  openOrder: (prefill?: OrderPrefill) => void;
  closeOrder: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const AppContext = createContext<AppState | null>(null);

const LS_LANG = "izoplus-lang";
const LS_THEME = "izoplus-theme";

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderPrefill, setOrderPrefill] = useState<OrderPrefill | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Hydrate from localStorage once (theme is also applied pre-paint by inline script)
  useEffect(() => {
    try {
      const l = localStorage.getItem(LS_LANG) as Lang | null;
      if (l === "uz" || l === "ru" || l === "en") setLangState(l);
      const th = localStorage.getItem(LS_THEME);
      if (th === "light" || th === "dark") setTheme(th);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(LS_THEME, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LS_LANG, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const openDetail = useCallback((d: DetailState) => {
    setDetail(d);
  }, []);
  const closeDetail = useCallback(() => setDetail(null), []);

  const openOrder = useCallback((prefill?: OrderPrefill) => {
    setOrderPrefill(prefill ?? null);
    setDetail(null);
    setSearchOpen(false);
    setOrderOpen(true);
  }, []);
  const closeOrder = useCallback(() => {
    setOrderOpen(false);
    setOrderPrefill(null);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const t = useMemo(() => getT(lang), [lang]);
  const tArr = useMemo(() => getTArray(lang), [lang]);

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      t,
      tArr,
      theme,
      toggleTheme,
      detail,
      openDetail,
      closeDetail,
      orderOpen,
      orderPrefill,
      openOrder,
      closeOrder,
      searchOpen,
      openSearch,
      closeSearch,
    }),
    [lang, setLang, t, tArr, theme, toggleTheme, detail, openDetail, closeDetail, orderOpen, orderPrefill, openOrder, closeOrder, searchOpen, openSearch, closeSearch]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/** Lock body scroll while a modal is open */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
