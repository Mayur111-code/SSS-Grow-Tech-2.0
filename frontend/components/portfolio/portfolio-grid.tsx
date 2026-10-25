"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useProjectsPublic, useCategoriesPublic } from "@/services/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PortfolioProjectCard } from "@/components/portfolio/portfolio-project-card";
import type { Project } from "@/types";

function PortfolioLoadingCards() {
  return (
    <div role="status" aria-label="Loading portfolio projects">
      <span className="sr-only">Loading portfolio projects...</span>
      <div aria-hidden="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white/90 dark:border-white/[0.08] dark:bg-[#10111b]/90"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-5 sm:p-6">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-slate-200 bg-white/70 px-6 py-14 text-center shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03] sm:px-10"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/[0.08] text-brand-600 dark:text-brand-300">
        <RefreshCw className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-sans text-lg font-semibold text-slate-900 dark:text-white">
        Projects are taking a moment to load
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
        Please check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#09090f]"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data, isLoading, isError, refetch } = useProjectsPublic({ limit: 100 });
  const { data: categories } = useCategoriesPublic();
  const prefersReducedMotion = useReducedMotion();

  const projects = (data?.items || []).filter((project: Project) => {
    if (activeCategory === "all") return true;
    const category = typeof project.category === "object" ? project.category : null;
    return category?.slug === activeCategory;
  });

  const reducedMotion = Boolean(prefersReducedMotion);

  return (
    <section
      id="portfolio-projects"
      aria-labelledby="portfolio-grid-title"
      className="relative scroll-mt-28 py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-brand-700 dark:text-brand-300">
              The portfolio
            </p>
            <h2
              id="portfolio-grid-title"
              className="mt-2 font-sans text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-3xl"
            >
              Selected <span className="text-gradient">projects</span>
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400" aria-live="polite">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
            {activeCategory !== "all" ? " in this category" : " available"}
          </p>
        </motion.div>

        <LayoutGroup id="portfolio-categories">
          <div
            role="group"
            aria-label="Filter projects by category"
            className="mb-8 flex flex-wrap gap-2 sm:mb-9"
          >
            {[
              { id: "all", label: "All" },
              ...(categories?.items
                .filter((category) => category.type === "project")
                .map((category) => ({ id: category.slug, label: category.name })) || []),
            ].map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  className={cn(
                    "relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#09090f]",
                    isActive
                      ? "border-brand-600 bg-brand-600 text-white shadow-[0_6px_18px_-10px_rgba(79,70,229,0.8)]"
                      : "border-slate-200/90 bg-white/70 text-slate-600 hover:border-brand-400/60 hover:text-brand-700 dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-slate-300 dark:hover:border-brand-400/40 dark:hover:text-brand-300"
                  )}
                >
                  {isActive && !reducedMotion && (
                    <motion.span
                      layoutId="portfolio-active-filter"
                      aria-hidden="true"
                      transition={{ type: "spring", stiffness: 480, damping: 38 }}
                      className="absolute inset-0 rounded-full bg-brand-600"
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>

        {isLoading ? (
          <PortfolioLoadingCards />
        ) : isError && !data ? (
          <PortfolioLoadError onRetry={() => void refetch()} />
        ) : projects.length === 0 ? (
          <div
            role="status"
            className="rounded-3xl border border-dashed border-slate-300/80 px-6 py-16 text-center dark:border-white/[0.12] sm:py-20"
          >
            <p className="text-base font-medium text-slate-600 dark:text-slate-300">
              No projects found in this category.
            </p>
            {activeCategory !== "all" && (
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300"
              >
                View all projects
              </button>
            )}
          </div>
        ) : (
          <LayoutGroup id="portfolio-project-grid">
            <motion.div
              layout={!reducedMotion}
              className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {projects.map((project: Project, index: number) => (
                  <PortfolioProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>
    </section>
  );
}
