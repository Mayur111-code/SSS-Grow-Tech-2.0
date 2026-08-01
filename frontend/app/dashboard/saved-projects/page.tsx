"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, ArrowRight, Inbox, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-table";
import api, { getErrorMessage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface SavedProject {
  _id: string;
  slug: string;
  title: string;
  thumbnail?: string;
  cover?: string;
  client?: string;
  industry?: string;
}

export default function SavedProjectsPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [items, setItems] = useState<SavedProject[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: { items: SavedProject[] } }>("/auth/saved-projects");
      setItems(res.data.data.items);
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unsave = async (projectId: string) => {
    try {
      await api.post("/auth/save-project", { projectId });
      setItems((prev) => prev?.filter((p) => p._id !== projectId) || null);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      success("Removed from saved");
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Saved Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Projects you have bookmarked for later</p>
        </div>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-8 w-8" />}
          title="No saved projects yet"
          message="When you bookmark projects from the portfolio, they will appear here."
          action={
            <Link href="/portfolio">
              <Button>Explore portfolio</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <div
              key={project._id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-brand-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-[#0f101a]"
            >
              <div className="relative h-44 overflow-hidden">
                {(project.thumbnail || project.cover) ? (
                  <Image
                    src={resolveImageUrl(project.thumbnail || project.cover || "")}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/20 to-accent-600/20">
                    <Bookmark className="h-10 w-10 text-brand-500/50" />
                  </div>
                )}
                {project.industry && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur dark:bg-black/60 dark:text-white">
                    {project.industry}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  {project.client && <p className="text-sm text-slate-500 dark:text-slate-400">{project.client}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/portfolio/${project.slug}`} className="text-brand-500 transition hover:text-brand-600">
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => unsave(project._id)}
                    className="text-slate-300 transition hover:text-red-500 dark:text-slate-600"
                    title="Remove"
                  >
                    <Bookmark className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
