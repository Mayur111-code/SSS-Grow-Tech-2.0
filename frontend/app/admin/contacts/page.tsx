"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Reply } from "lucide-react";
import { AdminList, AdminPageHeader } from "@/components/admin/admin-list";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea, Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api, { getErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { Contact } from "@/types";

const replySchema = z.object({
  reply: z.string().min(1, "Reply is required"),
  adminNotes: z.string().optional(),
  status: z.enum(["pending", "processing", "resolved", "closed"]),
});

type ReplyForm = z.infer<typeof replySchema>;

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [editing, setEditing] = useState<Contact | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    values: {
      reply: editing?.reply || "",
      adminNotes: editing?.adminNotes || "",
      status: editing?.status || "pending",
    },
  });

  const submit = async (data: ReplyForm) => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.post(`/contacts/${editing._id}/reply`, data);
      success("Reply sent");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contacts"
        description="Respond to contact requests and quote inquiries"
      />

      <AdminList<Contact>
        resource="contacts"
        searchPlaceholder="Search by name, email or subject..."
        onEdit={(a) => setEditing(a)}
        columns={[
          {
            key: "contact",
            header: "Contact",
            cell: (c) => (
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-slate-400">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
              </div>
            ),
          },
          {
            key: "subject",
            header: "Subject",
            cell: (c) => (
              <div>
                <p className="max-w-[300px] truncate text-sm font-medium text-slate-700 dark:text-slate-200">{c.subject}</p>
                <p className="max-w-[300px] truncate text-xs text-slate-400">{c.message}</p>
              </div>
            ),
          },
          {
            key: "type",
            header: "Type",
            cell: (c) => <Badge variant={c.type === "quote" ? "purple" : "info"}>{c.type}</Badge>,
          },
          {
            key: "date",
            header: "Received",
            cell: (c) => <span className="text-sm text-slate-500 dark:text-slate-400">{formatDateTime(c.createdAt)}</span>,
          },
          {
            key: "status",
            header: "Status",
            cell: (c) => <Badge variant={statusVariant(c.status)}>{c.status}</Badge>,
          },
        ]}
      />

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Reply to contact"
        description={editing ? `${editing.name} · ${editing.subject}` : ""}
        size="md"
      >
        {editing && (
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Original message</p>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{editing.message}</p>
            </div>
            <Textarea label="Reply" rows={4} placeholder="Type your response..." error={form.formState.errors.reply?.message} {...form.register("reply")} />
            <Input label="Admin notes (internal)" {...form.register("adminNotes")} />
            <div>
              <span className="block pb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700"
                {...form.register("status")}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" loading={saving}>
                <Reply className="h-4 w-4" /> Send reply
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
