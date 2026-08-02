"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, User } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useBlogsPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { formatDate, resolveImageUrl } from "@/lib/utils";
import type { Blog } from "@/types";

export function BlogSection() {
  const { data, isLoading } = useBlogsPublic({ limit: 3 });

  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Insights</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              Latest from the <span className="text-gradient">blog</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400"
            >
              All articles
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        {isLoading ? (
          <CardSkeleton className="mt-12" count={3} />
        ) : (
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.1}>
            {(data?.items || []).map((blog: Blog) => (
              <StaggerItem key={blog._id}>
                <Link href={`/blog/${blog.slug}`} className="group block h-full">
                  <div className="card-3d h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={resolveImageUrl(blog.thumbnail)}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(blog.publishDate)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3.5 w-3.5" /> {blog.author}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                        {blog.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{blog.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
