"use client";

import { MessageSquareText, Inbox, RefreshCw } from "lucide-react";
import { useMyContacts } from "@/services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-table";
import { formatDateTime } from "@/lib/utils";

export default function MyContactsPage() {
  const { data, isLoading } = useMyContacts();
  const queryClient = useQueryClient();

  const items = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Contact Requests</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your inquiries sent through the contact form</p>
        </div>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["contacts", "my"] })}>
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
          title="No contact requests yet"
          message="When you submit the contact form, your requests will appear here."
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10">
                    <MessageSquareText className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-slate-900 dark:text-white">{item.subject}</h3>
                      <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                  </div>
                </div>
              </div>
              <p className="mt-3 break-words text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
              {item.reply && (
                <div className="mt-3 rounded-xl bg-brand-500/5 p-4 text-sm">
                  <p className="font-semibold text-brand-600 dark:text-brand-400">Response from SSS Grow</p>
                  <p className="mt-1 break-words text-slate-700 dark:text-slate-300">{item.reply}</p>
                  {item.repliedAt && <p className="mt-1 text-xs text-slate-400">{formatDateTime(item.repliedAt)}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
