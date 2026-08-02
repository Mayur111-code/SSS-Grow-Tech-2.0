"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Layers, Tag } from "lucide-react";
import { PageLoader } from "@/components/ui/skeleton";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useServiceBySlug, useProjectsPublic, useCategoriesPublic } from "@/services/queries";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";

export function ServiceDetails({ slug }: { slug: string }) {
  const { data: service, isLoading } = useServiceBySlug(slug);
  const { data: projects } = useProjectsPublic();

  if (isLoading) return <PageLoader label="Loading service..." />;
  if (!service) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Service not found</h1>
        <Link href="/services">
          <span className="text-brand-600">Back to services</span>
        </Link>
      </div>
    );
  }

  const category = typeof service.category === "object" ? service.category : null;
  const relatedProjects = (projects?.items || []).filter(
    (p) => (typeof p.category === "object" && p.category?._id === category?._id) || !p.category
  );

  return (
    <>
      <section className="relative overflow-hidden bg-mesh pb-16 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {category && <Badge variant="brand">{category.name}</Badge>}
              {service.featured && <Badge variant="purple">Featured</Badge>}
              <Badge variant="success">Active</Badge>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              {service.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{service.shortDescription}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <Reveal>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Overview</h2>
                <div
                  className="prose prose-slate mt-4 max-w-none break-words leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </Reveal>

              {service.features?.length > 0 && (
                <Reveal className="mt-10">
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">What&apos;s included</h2>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0f101a]"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="space-y-6">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                    <Tag className="h-5 w-5 text-brand-500" /> Details
                  </h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">Category</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{category?.name || "General"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                      <dd className="font-medium text-emerald-600 dark:text-emerald-400">Available</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-accent-600 p-6 text-white">
                  <h3 className="font-display text-lg font-semibold">Ready to get started?</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Book a free consultation and get a tailored proposal for your project.
                  </p>
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-slate-100"
                  >
                    Request this service <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>

              {relatedProjects.length > 0 && (
                <Reveal delay={0.2}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                      <Layers className="h-5 w-5 text-brand-500" /> Related projects
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {relatedProjects.slice(0, 3).map((project) => (
                        <li key={project._id}>
                          <Link
                            href={`/portfolio/${project.slug}`}
                            className="group flex items-center justify-between text-sm font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200"
                          >
                            {project.title}
                            <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
