"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Building2, CalendarDays, ImageOff, MapPin } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import type { Project } from "@/types";

const portfolioCardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(index * 0.045, 0.27),
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

interface PortfolioProjectCardProps {
  project: Project;
  index: number;
  reducedMotion: boolean;
}

export const PortfolioProjectCard = forwardRef<HTMLElement, PortfolioProjectCardProps>(function PortfolioProjectCard(
  { project, index, reducedMotion },
  ref
) {
  const imageUrl = resolveImageUrl(project.cover, "");
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;
  const categoryName =
    typeof project.category === "object" && project.category
      ? project.category.name || project.industry
      : project.industry;
  const hasMetadata = Boolean(project.client || project.location || project.year);

  return (
    <motion.article
      ref={ref}
      custom={index}
      variants={portfolioCardVariants}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      exit={reducedMotion ? { opacity: 0, transition: { duration: 0.01 } } : "exit"}
      layout={!reducedMotion}
      whileHover={reducedMotion ? undefined : { y: -5 }}
      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
      transition={{
        layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        y: { type: "spring", stiffness: 360, damping: 30 },
        scale: { duration: 0.18 },
      }}
      className="h-full"
    >
      <Link
        href={`/portfolio/${project.slug}`}
        aria-label={`View ${project.title} project`}
        className="group block h-full rounded-[1.4rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-[#09090f]"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/90 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.22)] transition-[border-color,box-shadow,background-color] duration-300 group-hover:border-brand-400/50 group-hover:shadow-[0_24px_55px_-25px_rgba(15,23,42,0.3)] dark:border-white/[0.08] dark:bg-[#10111b]/90 dark:shadow-[0_18px_48px_-28px_rgba(0,0,0,0.8)] dark:group-hover:border-brand-400/35 dark:group-hover:shadow-[0_26px_65px_-28px_rgba(0,0,0,0.95)]">
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/70 dark:border-white/[0.06] dark:from-slate-900 dark:via-[#11131e] dark:to-indigo-950/40">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black,transparent_76%)]"
            />
            {showImage ? (
              <Image
                src={imageUrl}
                alt={`${project.title} project screenshot`}
                fill
                className="object-contain object-center p-3 sm:p-4"
                sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 2rem), (max-width: 1279px) 30vw, 380px"
                unoptimized
                onError={() => setFailedImageUrl(imageUrl)}
              />
            ) : (
              <div
                role="img"
                aria-label={`${project.title} preview unavailable`}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-500/15 bg-white/70 text-brand-500 shadow-sm dark:border-brand-400/15 dark:bg-white/[0.04] dark:text-brand-300">
                  <ImageOff className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Project preview unavailable
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex min-h-6 items-center justify-between gap-3">
              {categoryName ? (
                <span className="max-w-[70%] truncate rounded-full bg-brand-500/[0.08] px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-brand-700 dark:bg-brand-400/[0.1] dark:text-brand-300">
                  {categoryName}
                </span>
              ) : (
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  Project
                </span>
              )}
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-brand-600 dark:text-slate-500 dark:group-hover:text-brand-300">
                View project
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </div>

            <h3 className="mt-3 break-words font-sans text-lg font-semibold leading-snug tracking-[-0.025em] text-slate-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 sm:text-xl">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 min-h-12 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
              {project.description}
            </p>

            {hasMetadata && (
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
                {project.client && (
                  <span className="inline-flex max-w-full min-w-0 items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-brand-500/75" aria-hidden="true" />
                    <span className="truncate">{project.client}</span>
                  </span>
                )}
                {project.location && (
                  <span className="inline-flex max-w-full min-w-0 items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500/75" aria-hidden="true" />
                    <span className="truncate">{project.location}</span>
                  </span>
                )}
                {project.year && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand-500/75" aria-hidden="true" />
                    {project.year}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
});
