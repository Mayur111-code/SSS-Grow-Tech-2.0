"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, ExternalLink } from "lucide-react";
import { AdminList, AdminPageHeader } from "@/components/admin/admin-list";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api, { getErrorMessage } from "@/lib/api";
import { API_URL, formatDate, resolveImageUrl } from "@/lib/utils";
import type { Application, Career, User } from "@/types";

const statusSchema = z.object({
  status: z.enum(["pending", "reviewing", "shortlisted", "rejected", "hired"]),
  notes: z.string().optional(),
});

type StatusForm = z.infer<typeof statusSchema>;

export default function AdminApplicationsPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [editing, setEditing] = useState<Application | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    values: {
      status: editing?.status || "pending",
      notes: editing?.notes || "",
    },
  });

  const submit = async (data: StatusForm) => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.patch(`/applications/${editing._id}/status`, data);
      success("Application updated");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Applications"
        description="Review job applications and update their status"
      />

      <AdminList<Application>
        resource="applications"
        searchPlaceholder="Search by name, email or phone..."
        onEdit={(a) => setEditing(a)}
        columns={[
          {
            key: "applicant",
            header: "Applicant",
            cell: (a) => {
              const user = a.user as User | null | undefined;
              return (
                <div className="flex items-center gap-3">
                  {user && typeof user === "object" && user.avatar ? (
                    <img src={resolveImageUrl(user.avatar)} alt={a.name} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-xs font-bold text-white">
                      {(a.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{a.name || "Unknown applicant"}</p>
                    <p className="text-xs text-slate-400">{a.email || "—"}</p>
                  </div>
                </div>
              );
            },
          },
          {
            key: "position",
            header: "Position",
            cell: (a) => {
              const career = a.career as Career | null | undefined;
              return (
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {career && typeof career === "object" ? career.title : "Position unavailable"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {career && typeof career === "object" && career.department ? career.department : ""}
                  </p>
                </div>
              );
            },
          },
          {
            key: "phone",
            header: "Phone",
            cell: (a) => <span className="text-sm text-slate-600 dark:text-slate-300">{a.phone || "—"}</span>,
          },
          {
            key: "applied",
            header: "Applied",
            cell: (a) => <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(a.createdAt)}</span>,
          },
          {
            key: "status",
            header: "Status",
            cell: (a) => <Badge variant={statusVariant(a.status)}>{a.status}</Badge>,
          },
          {
            key: "resume",
            header: "Resume",
            cell: (a) => a.resume ? (
              <a
                href={a.resume.startsWith("http") ? a.resume : `${API_URL}${a.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline dark:text-brand-400"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="h-4 w-4" /> View
              </a>
            ) : <span className="text-sm text-slate-400">—</span>,
          },
        ]}
      />

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Update application"
        description={editing ? `${editing.name} · ${(editing.career as Career)?.title || ""}` : ""}
        size="md"
      >
        {editing && (
          <div className="space-y-4">
            {editing.coverLetter && (
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cover letter</p>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{editing.coverLetter}</p>
              </div>
            )}
            {editing.portfolioUrl && (
              <a
                href={editing.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline dark:text-brand-400"
              >
                <ExternalLink className="h-4 w-4" /> Portfolio
              </a>
            )}
            {editing.resume && (
              <a
                href={editing.resume.startsWith("http") ? editing.resume : `${API_URL}${editing.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline dark:text-brand-400"
              >
                <FileText className="h-4 w-4" /> View resume
              </a>
            )}
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <div>
                <span className="block pb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700"
                  {...form.register("status")}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              <Textarea label="Notes" rows={3} placeholder="Internal notes..." {...form.register("notes")} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" loading={saving}>Save status</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
