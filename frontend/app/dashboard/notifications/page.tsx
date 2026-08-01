"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useAdminNotifications } from "@/services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/data-table";
import { Badge, statusVariant } from "@/components/ui/badge";
import api, { getErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { data, isLoading } = useAdminNotifications({ limit: 50 });
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [busy, setBusy] = useState(false);

  const items = data?.items || [];
  const unread = data?.unread || 0;

  const markAllRead = async () => {
    setBusy(true);
    try {
      await api.patch("/notifications/read-all");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      success("All notifications marked as read");
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {unread > 0 ? `You have ${unread} unread notification${unread > 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={markAllRead} loading={busy}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          message="Updates about your requests and applications will appear here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => !item.isRead && markRead(item._id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition",
                item.isRead
                  ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]"
                  : "border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  item.type === "info"
                    ? "bg-sky-500/10 text-sky-500"
                    : item.type === "success"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : item.type === "warning"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-brand-500/10 text-brand-500"
                )}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  {item.type && <Badge variant={statusVariant(item.type)}>{item.type}</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
              </div>
              {!item.isRead && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />}
            </button>
          ))}

          <div className="pt-2 text-center">
            <Link href="/dashboard" className="text-sm text-brand-500 transition hover:text-brand-600">
              Back to dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
