"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function PageHeader({
  badge,
  title,
  description,
  children,
  image,
}: {
  badge?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
      {/* Background image — clearly visible */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            unoptimized
          />
          {/* Light mode: soft warm overlay from bottom — keeps image visible while text reads well */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/70 dark:from-[#09090f]/50 dark:via-[#09090f]/25 dark:to-[#09090f]/65" />
        </div>
      )}

      {/* Decorative mesh overlay — always on top of image */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      {/* Decorative blob */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-brand-400/10 blur-[120px] animate-aurora dark:bg-brand-500/15" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur-md dark:bg-white/10 dark:text-brand-400"
          >
            {badge}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance mx-auto mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300"
          >
            {description}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
