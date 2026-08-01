"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/hooks/use-animations";
import { useTechnologiesPublic } from "@/services/queries";
import type { Technology } from "@/types";

export function TechMarquee() {
  const { data } = useTechnologiesPublic();
  const items = data?.items || [];

  const renderRow = (reverse = false) => (
    <div
      className="flex shrink-0 items-center gap-4 pr-4"
      style={{ animation: `marquee ${30 + items.length}s linear infinite${reverse ? " reverse" : ""}` }}
    >
      {items.map((tech: Technology) => (
        <div
          key={tech._id}
          className="glass-panel flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:scale-105 dark:text-slate-300"
        >
          <span className="h-2.5 w-2.5 rounded-full glow-dot" style={{ backgroundColor: tech.color || "#6366f1" }} />
          {tech.name}
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden py-14">
      <Reveal className="mx-auto max-w-2xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Technology Stack</p>
        <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Powering innovation with the latest tools
        </h2>
      </Reveal>
      <div className="relative mt-10 space-y-4">
        <div className="mask-fade-x flex overflow-hidden">
          {renderRow()}
          {renderRow()}
        </div>
      </div>
    </section>
  );
}
