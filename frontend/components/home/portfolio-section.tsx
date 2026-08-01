"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Gauge, ShieldCheck, Rocket, Layers } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useProjectsPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { TiltCard } from "@/components/effects/tilt-card";
import { resolveImageUrl } from "@/lib/utils";
import type { Project } from "@/types";

export function PortfolioSection() {
  const { data, isLoading } = useProjectsPublic({ limit: 3 });

  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Work</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Featured <span className="text-gradient">projects</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400"
            >
              View all projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        {isLoading ? (
          <CardSkeleton className="mt-12" count={3} />
        ) : (
          <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.12}>
            {(data?.items || []).map((project: Project) => (
              <StaggerItem key={project._id}>
                <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                  <TiltCard className="h-full" intensity={8}>
                    <div className="gradient-border relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={resolveImageUrl(project.cover)}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-xs font-medium text-white/70">{project.industry || project.client}</p>
                          <p className="mt-0.5 font-display text-lg font-semibold text-white">{project.title}</p>
                        </div>
                      </div>
                      <div className="tilt-inner flex items-center justify-between p-5">
                        <div>
                          <p className="font-display text-base font-semibold text-slate-900 dark:text-white">{project.client}</p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{project.location}</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-brand-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
