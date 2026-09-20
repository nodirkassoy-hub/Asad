"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

/** Mobile sticky order button — appears after the hero, hidden while a modal is open */
export default function StickyOrder() {
  const { t, openOrder, orderOpen, detail, searchOpen } = useApp();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && !orderOpen && !detail && !searchOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.21, 0.65, 0.28, 0.99] }}
          className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 md:hidden"
        >
          <button
            onClick={() => openOrder()}
            className="btn-primary w-full py-4 text-sm shadow-glow-lg"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9" />
              <path d="M21 3v6h-6" />
            </svg>
            {t("sticky.order")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
