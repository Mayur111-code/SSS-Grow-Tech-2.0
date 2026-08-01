"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import {
  AdminList,
  useAdminResource,
  AdminPageHeader,
  AdminModal,
} from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api, { getErrorMessage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import { useAdminList } from "@/services/queries";
import type { Category, Service } from "@/types";

const serviceFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  description: z.string().min(10, "Description is required"),
  category: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]),
  featured: z.boolean(),
  sortOrder: z.coerce.number().optional(),
});

type ServiceForm = z.infer<typeof serviceFormSchema>;

export default function AdminServicesPage() {
  const { success, error } = useToast();
  const {
    editing, setEditing, deleteTarget, setDeleteTarget, deleteLoading, reload, handleToggle, handleDelete,
  } = useAdminResource<Service>("services");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState("");
  const { data: categoriesData } = useAdminList<Category>("categories");

  const categories = categoriesData?.items || [];

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceFormSchema),
    values: {
      title: editing?.title || "",
      shortDescription: editing?.shortDescription || "",
      description: editing?.description || "",
      category: (editing?.category as Category | null | undefined)?._id || (editing?.category as string | null) || "",
      status: editing?.status || "active",
      featured: editing?.featured ?? false,
      sortOrder: editing?.sortOrder || 0,
    },
  });

  const openCreate = () => {
    setEditing(null);
    setImage("");
    form.reset({ title: "", shortDescription: "", description: "", category: "", status: "active", featured: false, sortOrder: 0 });
    setFormOpen(true);
  };

  const openEdit = (item: Service) => {
    setEditing(item);
    setImage(item.image || "");
    setFormOpen(true);
  };

  const submit = async (data: ServiceForm) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        image: image || "",
        category: data.category || null,
      };
      if (editing) {
        await api.patch(`/services/${editing._id}`, payload);
        success("Service updated");
      } else {
        await api.post("/services", payload);
        success("Service created");
      }
      setFormOpen(false);
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
        title="Services"
        description="Manage the services you offer"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add service
          </Button>
        }
      />

      <AdminList
        resource="services"
        searchPlaceholder="Search services..."
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
        columns={[
          {
            key: "service",
            header: "Service",
            cell: (s) => (
              <div className="flex items-center gap-3">
                {s.image ? (
                  <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <img src={resolveImageUrl(s.image)} alt={s.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-brand-500/10">
                    <Wrench className="h-5 w-5 text-brand-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{s.title}</p>
                  <p className="max-w-[280px] truncate text-xs text-slate-400">{s.shortDescription}</p>
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            cell: (s) => {
              const cat = s.category as Category | string | null | undefined;
              return <span className="text-sm text-slate-600 dark:text-slate-300">{typeof cat === "string" ? cat : cat?.name || "—"}</span>;
            },
          },
          {
            key: "status",
            header: "Status",
            cell: (s) => <Badge variant={s.status === "active" ? "success" : "danger"}>{s.status}</Badge>,
          },
          {
            key: "featured",
            header: "Featured",
            cell: (s) => <Badge variant={s.featured ? "brand" : "neutral"}>{s.featured ? "Yes" : "No"}</Badge>,
          },
        ]}
      />

      <AdminModal<Service>
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit service" : "Add service"}
        description={editing ? `Updating ${editing.title}` : "Create a new service"}
        size="lg"
      >
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <ImageUpload value={image} onChange={setImage} label="Service image" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" error={form.formState.errors.title?.message} {...form.register("title")} />
            <div>
              <span className="block pb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
              <select className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700" {...form.register("category")}>
                <option value="">No category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <Textarea label="Short description" rows={2} error={form.formState.errors.shortDescription?.message} {...form.register("shortDescription")} />
          <Textarea label="Description" rows={5} error={form.formState.errors.description?.message} {...form.register("description")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <span className="block pb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <select className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700" {...form.register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2.5">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" {...form.register("featured")} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Featured</span>
            </label>
            <Input label="Sort order" type="number" {...form.register("sortOrder")} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Create service"}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this service?"
        message={`This will permanently delete "${deleteTarget?.title}".`}
      />
    </div>
  );
}
