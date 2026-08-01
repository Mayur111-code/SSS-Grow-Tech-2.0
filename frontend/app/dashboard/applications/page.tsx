"use client";

import Link from "next/link";
import { Briefcase, Inbox, RefreshCw, FileText } from "lucide-react";
import { useMyApplications } from "@/services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-table";
import { API_URL, formatDate } from "@/lib/utils";
import type { Career } from "@/types";

export default function MyApplicationsPage() {
  const { data, isLoading } = useMyApplications();
  const queryClient = useQueryClient();

  const items = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Career Applications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your job applications and their status</p>
        </div>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["applications", "my"] })}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title="No applications yet"
          message="Browse open positions and apply from the careers page."
          action={
            <Link href="/careers">
              <Button>Browse careers</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const career = item.career as Career | undefined;
            return (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                      <Briefcase className="h-5 w-5 text-brand-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {career?.title || "Job application"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {career?.department ? `${career.department} · ` : ""}
                        Applied {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                </div>

                {item.coverLetter && (
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{item.coverLetter}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.resume && (
                    <a
                      href={item.resume.startsWith("http") ? item.resume : `${API_URL}${item.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
                    >
                      <FileText className="h-3.5 w-3.5" /> View resume
                    </a>
                  )}
                  {career?.slug && (
                    <Link
                      href={`/careers/${career.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
                    >
                      View job
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
