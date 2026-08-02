"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  MapPin,
  Building2,
  Clock,
  Check,
  ExternalLink,
  Github,
} from "lucide-react";
import { PageLoader } from "@/components/ui/skeleton";
import { Reveal } from "@/hooks/use-animations";
import { useProjectBySlug } from "@/services/queries";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api, { getErrorMessage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import { useState } from "react";
import type { ApiResponse, Technology } from "@/types";

export function ProjectDetails({ slug }: { slug: string }) {
  const { data: project, isLoading } = useProjectBySlug(slug);
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [saved, setSaved] = useState(() =>
    Boolean(user?.savedProjects?.some((id) => id === project?._id))
  );
  const [saving, setSaving] = useState(false);

  if (isLoading) return <PageLoader label="Loading project..." />;
  if (!project) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Project not found</h1>
        <Link href="/portfolio">
          <span className="text-brand-600">Back to portfolio</span>
        </Link>
      </div>
    );
  }

  const technologies = (project.technologies || [])
    .map((t) => (typeof t === "object" && t ? t : null))
    .filter((t): t is Technology => t !== null);

  const handleSave = async () => {
    if (!isAuthenticated) {
      info("Login required", "Please login to save projects.");
      return;
    }
    setSaving(true);
    try {
      const response = await api.post<ApiResponse<{ saved: boolean }>>("/auth/save-project", {
        projectId: project._id,
      });
      setSaved(response.data.data.saved);
      success(response.data.data.saved ? "Project saved" : "Project removed from saved");
    } catch (err) {
      error("Failed to update", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-mesh pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {typeof project.category === "object" && project.category && (
                <Badge variant="brand">{project.category.name}</Badge>
              )}
              <Badge variant="success">{project.status}</Badge>
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              {project.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              {project.client && (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-500" /> {project.client}
                </span>
              )}
              {project.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-500" /> {project.location}
                </span>
              )}
              {project.year && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-500" /> {project.year}
                </span>
              )}
              {project.duration && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-500" /> {project.duration}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative aspect-[16/8] overflow-hidden rounded-3xl">
              <Image
                src={resolveImageUrl(project.cover)}
                alt={project.title}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            </div>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <Reveal>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Project overview</h2>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>
              </Reveal>

              {project.features?.length > 0 && (
                <Reveal className="mt-10">
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Key features</h2>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0f101a]"
                      >
                        <Check className="h-4 w-4 shrink-0 text-brand-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {project.gallery?.length > 0 && (
                <Reveal className="mt-10">
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Gallery</h2>
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                        <Image
                          src={resolveImageUrl(img)}
                          alt={`${project.title} gallery ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="space-y-6">
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Project details</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">Client</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{project.client || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">Industry</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{project.industry || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">Year</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{project.year || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">Duration</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{project.duration || "—"}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
                    >
                      {saved ? "Saved ✓" : "Save project"}
                    </button>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                      >
                        Live <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                    >
                      <Github className="h-3.5 w-3.5" /> View source
                    </a>
                  )}
                </div>
              </Reveal>

              {technologies.length > 0 && (
                <Reveal delay={0.15}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                    <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Technologies</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech._id}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                        >
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tech.color }} />
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.2}>
                <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-accent-600 p-6 text-white">
                  <h3 className="font-display text-lg font-semibold">Have a similar project?</h3>
                  <p className="mt-2 text-sm text-white/80">Let&apos;s build something great together.</p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-slate-100"
                  >
                    Start a project <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
