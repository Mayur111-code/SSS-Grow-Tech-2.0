"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useServicesPublic, useCategoriesPublic, useProjectsPublic, useTechnologiesPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

export function ServicesGrid() {
  const { data, isLoading } = useServicesPublic();
  const { data: categories } = useCategoriesPublic();

  const services = data?.items || [];

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
            <Link
              href="/services"
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                "bg-brand-600 text-white"
              )}
            >
              All Services
            </Link>
            {categories?.items
              .filter((c) => c.type === "service")
              .map((cat) => (
                <Link
                  key={cat._id}
                  href={`/services?category=${cat.slug}`}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {cat.name}
                </Link>
              ))}
          </Reveal>

          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {services.map((service: Service, index: number) => (
                <StaggerItem key={service._id}>
                  <Link href={`/services/${service.slug}`} className="group block h-full">
                    <div className="card-3d relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-[#0f101a]">
                      {service.featured && (
                        <span className="absolute right-4 top-4">
                          <Badge variant="brand">
                            <Sparkles className="h-3 w-3" /> Featured
                          </Badge>
                        </span>
                      )}
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-[0_10px_30px_-8px_rgba(99,102,241,0.6)]">
                        <span className="font-display text-xl font-bold">{index + 1}</span>
                      </div>
                      <h2 className="mt-5 font-display text-xl font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                        {service.title}
                      </h2>
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {service.shortDescription}
                      </p>
                      {service.features?.slice(0, 3).length > 0 && (
                        <ul className="mt-5 space-y-2">
                          {service.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <Check className="h-4 w-4 shrink-0 text-brand-500" /> {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
                        Explore service
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          <Reveal className="mt-16">
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-brand-700 to-accent-600 p-10 text-center sm:flex-row sm:text-left">
              <div>
                <h3 className="font-display text-2xl font-bold text-white">Need a custom solution?</h3>
                <p className="mt-1 text-white/80">Tell us about your project and get a free consultation.</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-slate-100"
              >
                Start a project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
