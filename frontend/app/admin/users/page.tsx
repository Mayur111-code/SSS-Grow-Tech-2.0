"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AdminList,
  useAdminResource,
  AdminPageHeader,
  AdminModal,
} from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api, { getErrorMessage } from "@/lib/api";
import { resolveImageUrl, formatDate } from "@/lib/utils";
import type { User } from "@/types";

const userFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean(),
});

type UserForm = z.infer<typeof userFormSchema>;

export default function AdminUsersPage() {
  const { success, error } = useToast();
  const {
    editing, setEditing, deleteTarget, setDeleteTarget, deleteLoading, reload, handleToggle, handleDelete,
  } = useAdminResource<User>("users");
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    values: {
      name: editing?.name || "",
      email: editing?.email || "",
      phone: editing?.phone || "",
      company: editing?.company || "",
      role: editing?.role || "user",
      isActive: editing?.isActive ?? true,
    },
  });

  const submit = async (data: UserForm) => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.patch(`/users/${editing._id}`, data);
      success("User updated");
      form.reset();
      setEditing(null);
      setEditOpen(false);
      reload();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Manage user accounts and roles"
      />

      <AdminList
        resource="users"
        searchPlaceholder="Search by name or email..."
        onEdit={(u) => { setEditing(u); setEditOpen(true); }}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
        columns={[
          {
            key: "user",
            header: "User",
            cell: (u) => (
              <div className="flex items-center gap-3">
                {u.avatar ? (
                  <Image src={resolveImageUrl(u.avatar)} alt={u.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-xs font-bold text-white">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            cell: (u) => <Badge variant={u.role === "admin" ? "brand" : "neutral"}>{u.role}</Badge>,
          },
          {
            key: "status",
            header: "Status",
            cell: (u) => <Badge variant={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Inactive"}</Badge>,
          },
          {
            key: "company",
            header: "Company",
            cell: (u) => <span className="text-sm text-slate-600 dark:text-slate-300">{u.company || "—"}</span>,
          },
          {
            key: "joined",
            header: "Joined",
            cell: (u) => <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(u.createdAt)}</span>,
          },
        ]}
      />

      <AdminModal<User>
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditing(null); }}
        title="Edit user"
        description={editing ? `Updating ${editing.name}` : "Edit user"}
        size="md"
      >
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Input label="Full name" error={form.formState.errors.name?.message} {...form.register("name")} />
          <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
          <Input label="Phone" {...form.register("phone")} />
          <Input label="Company" {...form.register("company")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Role</span>
              <select className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700" {...form.register("role")}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="flex items-end gap-2 pb-2.5">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" {...form.register("isActive")} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Active</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save changes</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this user?"
        message={`This will permanently delete ${deleteTarget?.name || "this user"}'s account.`}
      />
    </div>
  );
}
