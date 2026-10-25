"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";

const heroVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.1,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function PortfolioHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="portfolio-hero-title"
      className="relative isolate overflow-hidden border-b border-slate-200/70 bg-mesh pb-14 pt-32 dark:border-white/[0.07] sm:pb-16 sm:pt-36 lg:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.22] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-44 h-[30rem] w-[30rem] rounded-full bg-brand-400/[0.09] blur-[110px] dark:bg-brand-500/[0.12]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-72 top-1/2 hidden h-[42rem] w-[42rem] -translate-y-1/2 lg:block"
      >
        <div className="absolute inset-0 rounded-full border border-brand-500/[0.09]" />
        <div className="absolute inset-10 rounded-full border border-dashed border-brand-500/[0.12]" />
        <div className="absolute inset-20 rounded-full border border-brand-500/[0.08]" />
        <div className="absolute left-[27%] top-[22%] h-2 w-2 rounded-full bg-brand-500/60 shadow-[0_0_18px_rgba(99,102,241,0.35)]" />
        <div className="absolute bottom-[24%] right-[25%] h-1.5 w-1.5 rounded-full bg-accent-500/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative max-w-5xl"
          variants={heroVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300 sm:text-sm">
              Selected work
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-brand-500/30" />
            <span className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">SSS Grow Tech</span>
          </motion.div>

          <motion.h1
            id="portfolio-hero-title"
            variants={heroItemVariants}
            className="mt-6 max-w-5xl font-sans text-[clamp(2.55rem,7.2vw,5.9rem)] font-semibold leading-[1.045] tracking-[-0.055em] text-slate-950 dark:text-white"
          >
            <span className="block">Our work.</span>
            <span className="block">
              Your next <span className="text-gradient">breakthrough.</span>
            </span>
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:mt-7 sm:text-lg sm:leading-8"
          >
            A selection of projects we&apos;re proud of — from enterprise platforms to award-winning mobile apps.
          </motion.p>

          <motion.a
            variants={heroItemVariants}
            href="#portfolio-projects"
            className="group mt-8 inline-flex min-h-11 items-center gap-3 rounded-full border border-slate-300/80 bg-white/65 py-2 pl-4 pr-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-brand-400/70 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-brand-400/60 dark:hover:text-brand-300 dark:focus-visible:ring-offset-[#09090f]"
          >
            Explore the work
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white transition-transform duration-300 group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
