"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Code2, Cloud, BrainCircuit, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import { useCounter } from "@/hooks/use-animations";

const stats = [
  { value: 250, suffix: "+", label: "Projects Delivered" },
  { value: 120, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 15, suffix: "+", label: "Industry Awards" },
];

const floatingBadges = [
  { icon: Code2, className: "top-[18%] left-[4%]", delay: 0, label: "Web" },
  { icon: Cloud, className: "top-[58%] left-[10%]", delay: 1.2, label: "Cloud" },
  { icon: BrainCircuit, className: "top-[26%] right-[6%]", delay: 0.6, label: "AI" },
];

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { value: count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
        {count}
        <span className="text-gradient">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 80, damping: 20 });
  const springY = useSpring(my, { stiffness: 80, damping: 20 });
  const glowX = useTransform(springX, (v) => `${50 + v * 30}%`);
  const glowY = useTransform(springY, (v) => `${50 + v * 30}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-mesh pt-36 pb-20 sm:pt-44 sm:pb-28"
    >
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(99,102,241,0.35), rgba(139,92,246,0.18) 40%, transparent 70%)`
          ),
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-white/40 px-4 py-1.5 text-xs font-medium text-brand-600 backdrop-blur-md dark:bg-white/5 dark:text-brand-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Premium IT Services Agency
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white"
        >
          We Build Digital Products That{" "}
          <span className="animated-gradient-text">Grow Your Business</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
        >
          SSS Grow Tech delivers world-class software, web, mobile, AI and cloud solutions.
          From idea to launch, we engineer digital experiences that scale with you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
        >
          <Magnetic>
            <Link href="/contact" className="block w-full sm:w-auto">
              <Button size="lg" variant="gradient" magnetic className="w-full btn-shine sm:w-auto">
                Start Your Project <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/portfolio" className="block w-full sm:w-auto">
              <Button size="lg" variant="outline" magnetic className="w-full sm:w-auto">
                <Play className="h-4 w-4" /> View Our Work
              </Button>
            </Link>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400"
        >
          <MousePointer2 className="h-3.5 w-3.5" />
          <span>Explore our services below</span>
        </motion.div>

        {floatingBadges.map((badge) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + badge.delay, type: "spring" }}
            className={`absolute z-10 hidden lg:block ${badge.className}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 3, -2, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: badge.delay, ease: "easeInOut" }}
              className="glass-panel flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-soft"
            >
              <badge.icon className="h-5 w-5 text-brand-500" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{badge.label}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel relative overflow-hidden rounded-3xl p-6 shadow-card sm:p-10"
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <StatItem {...stat} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
