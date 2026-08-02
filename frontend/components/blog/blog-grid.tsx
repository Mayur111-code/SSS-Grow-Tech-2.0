"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CalendarDays, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogsPublic, useCategoriesPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate, resolveImageUrl, cn } from "@/lib/utils";
import type { Blog } from "@/types";

export function BlogGrid() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBlogsPublic({ page, limit: 9, search });
  const { data: categories } = useCategoriesPublic();

  const blogs = data?.items || [];
  const pagination = data?.pagination;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles..."
              className="pl-11"
            />
          </div>
        </Reveal>

        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              setActiveCategory("all");
              setPage(1);
            }}
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
            .filter((c) => c.type === "blog")
            .map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setPage(1);
                }}
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
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-slate-500">No articles found matching your search.</div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {blogs.map((blog: Blog) => (
              <StaggerItem key={blog._id}>
                <Link href={`/blog/${blog.slug}`} className="group block h-full">
                  <motion.article
                    whileHover={{ y: -6 }}
                    className="card-3d h-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={resolveImageUrl(blog.thumbnail)}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      {typeof blog.category === "object" && blog.category && (
                        <span className="absolute left-3 top-3">
                          <Badge variant="brand">{blog.category.name}</Badge>
                        </span>
                      )}
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
                      <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                        {blog.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{blog.excerpt}</p>
                    </div>
                  </motion.article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-500 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-sm text-slate-600 dark:text-slate-300">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-500 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
