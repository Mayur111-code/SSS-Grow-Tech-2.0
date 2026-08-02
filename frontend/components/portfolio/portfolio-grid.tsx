"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useProjectsPublic, useCategoriesPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { resolveImageUrl, cn } from "@/lib/utils";
import type { Project } from "@/types";

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data, isLoading } = useProjectsPublic({ limit: 100 });
  const { data: categories } = useCategoriesPublic();

  const projects = (data?.items || []).filter((p) => {
    if (activeCategory === "all") return true;
    const cat = typeof p.category === "object" ? p.category : null;
    return cat?.slug === activeCategory;
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              activeCategory === "all"
                ? "bg-brand-600 text-white"
                : "border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
            )}
          >
            All
          </button>
          {categories?.items
            .filter((c) => c.type === "project")
            .map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition",
                  activeCategory === cat.slug
                    ? "bg-brand-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
                )}
              >
                {cat.name}
              </button>
            ))}
        </Reveal>

        {isLoading ? (
          <CardSkeleton count={6} />
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-slate-500">No projects found in this category.</div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {projects.map((project: Project) => (
              <StaggerItem key={project._id}>
                <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="card-3d relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={resolveImageUrl(project.cover)}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5">
                        {typeof project.category === "object" && project.category && (
                          <span className="text-xs font-medium text-brand-300">{project.category.name}</span>
                        )}
                        <h3 className="mt-1 font-display text-lg font-semibold text-white">{project.title}</h3>
                        <p className="mt-0.5 text-xs text-white/70">
                          {project.client} · {project.location}
                        </p>
                      </div>
                      <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
