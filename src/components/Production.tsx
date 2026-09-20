"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { SectionHeading } from "./ui";

const STAGES = [
  { n: "01", key: 1, image: "/images/prod-1.jpg" },
  { n: "02", key: 2, image: "/images/prod-2.jpg" },
  { n: "03", key: 3, image: "/images/prod-3.jpg" },
  { n: "04", key: 4, image: "/images/prod-4.jpg" },
  { n: "05", key: 5, image: "/images/prod-5.jpg" },
  { n: "06", key: 6, image: "/images/prod-6.jpg" },
] as const;

/** dot on the timeline line; lights up when its row is in the middle band */
function StageDot() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { rootMargin: "-38% 0px -38% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
          active
            ? "scale-110 border-cyan-400 bg-cyan-400/20 shadow-[0_0_24px_rgba(34,211,238,0.55)]"
            : "border-[var(--glass-border)] bg-ink-900 dark:bg-ink-900"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
            active ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" : "bg-slate-500"
          }`}
        />
      </div>
    </div>
  );
}

function StageCard({ stage, index, isAlt }: { stage: (typeof STAGES)[number]; index: number; isAlt: boolean }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { rootMargin: "-38% 0px -38% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cardTone = active
    ? "border-cyan-400/40 shadow-glow"
    : "border-[var(--glass-border)]";

  return (
    <div ref={rowRef} className="relative md:grid md:grid-cols-2 md:items-center md:gap-12">
      {/* node */}
      <div className="absolute left-4 top-5 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
        <StageDot />
      </div>

      {/* text card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: isAlt ? 46 : -46 }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-35% 0px -35% 0px" }}
        transition={{ duration: 0.7, ease: [0.21, 0.65, 0.28, 0.99] }}
        className={`ml-12 md:ml-0 ${isAlt ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
      >
        <div className={`glass-card transition-all duration-500 ${cardTone} p-5 sm:p-6`}>
          <div className={`flex items-center gap-3 ${isAlt ? "" : "md:flex-row-reverse"}`}>
            <span className="text-3xl font-black tracking-tight text-transparent [-webkit-text-stroke:1.5px_rgba(34,211,238,0.75)] sm:text-4xl">
              {stage.n}
            </span>
            <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">{t(`prod.stage.${stage.key}.n`)}</h3>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-c">{t(`prod.stage.${stage.key}.d`)}</p>
        </div>
      </motion.div>

      {/* image card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: isAlt ? -46 : 46 }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "-35% 0px -35% 0px" }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.21, 0.65, 0.28, 0.99] }}
        className={`ml-12 mt-4 md:ml-0 md:mt-0 ${
          isAlt ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"
        }`}
      >
        <div
          className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ${cardTone}`}
        >
          <img
            src={stage.image}
            alt={t(`prod.stage.${stage.key}.n`)}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-4 rounded-full bg-ink-950/70 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md">
            {stage.n} / 06
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Production() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 90, damping: 25 });

  return (
    <section id="production" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading kicker={t("prod.kicker")} title={t("prod.title")} sub={t("prod.sub")} />

        <div ref={sectionRef} className="relative space-y-12 md:space-y-20">
          {/* base line */}
          <div
            aria-hidden
            className="absolute bottom-5 left-4 top-5 w-px -translate-x-1/2 bg-[var(--glass-border)] md:left-1/2"
          >
            {/* progress line */}
            <motion.div
              style={reduce ? { height: "100%" } : { scaleY, transformOrigin: "top" }}
              className="absolute inset-0 bg-gradient-to-b from-sky-400 via-cyan-300 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
            />
          </div>

          {STAGES.map((s, i) => (
            <StageCard key={s.n} stage={s} index={i} isAlt={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
