"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { ArrowLeft, CalendarDays, Eye, User } from "lucide-react";
import { PageLoader } from "@/components/ui/skeleton";
import { Reveal } from "@/hooks/use-animations";
import { useBlogBySlug, useRelatedBlogs } from "@/services/queries";
import { Badge } from "@/components/ui/badge";
import { formatDate, resolveImageUrl } from "@/lib/utils";
import api from "@/lib/api";

export function BlogDetails({ slug }: { slug: string }) {
  const { data: blog, isLoading } = useBlogBySlug(slug);
  const { data: related } = useRelatedBlogs(blog?._id);

  useEffect(() => {
    if (blog?._id) {
      api.post(`/blogs/${blog._id}/views`).catch(() => {});
    }
  }, [blog?._id]);

  if (isLoading) return <PageLoader label="Loading article..." />;
  if (!blog) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Article not found</h1>
        <Link href="/blog">
          <span className="text-brand-600">Back to blog</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-mesh pb-12 pt-28 sm:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {typeof blog.category === "object" && blog.category && (
                <Badge variant="brand">{blog.category.name}</Badge>
              )}
              {blog.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              {blog.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-brand-500" /> {blog.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-brand-500" /> {formatDate(blog.publishDate)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4 text-brand-500" /> {blog.views || 0} views
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
              <Image
                src={resolveImageUrl(blog.banner || blog.thumbnail)}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 896px"
                unoptimized
              />
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <article
              className="prose prose-lg prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6 dark:border-slate-800">
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {related && related.items && related.items.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Related articles</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.items.map((item) => (
                  <Link key={item._id} href={`/blog/${item.slug}`} className="group block">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={resolveImageUrl(item.thumbnail)}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 font-display text-sm font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{formatDate(item.publishDate)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
