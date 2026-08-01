"use client";

import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
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
import type { Category, Project } from "@/types";

const projectFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  client: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  year: z.coerce.number().optional(),
  category: z.string().optional().nullable(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  status: z.enum(["published", "draft", "archived"]),
  featured: z.boolean(),
});

type ProjectForm = z.infer<typeof projectFormSchema>;

export default function AdminProjectsPage() {
  const { success, error } = useToast();
  const {
    editing, setEditing, deleteTarget, setDeleteTarget, deleteLoading, reload, handleToggle, handleDelete,
  } = useAdminResource<Project>("projects");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState("");
  const { data: categoriesData } = useAdminList<Category>("categories");
  const categories = categoriesData?.items || [];

  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    values: {
      title: editing?.title || "",
      description: editing?.description || "",
      client: editing?.client || "",
      industry: editing?.industry || "",
      location: editing?.location || "",
      year: editing?.year || new Date().getFullYear(),
      category: (editing?.category as Category | null | undefined)?._id || (editing?.category as string | null) || "",
      liveUrl: editing?.liveUrl || "",
      githubUrl: editing?.githubUrl || "",
      status: editing?.status || "published",
      featured: editing?.featured ?? false,
    },
  });

  const openCreate = () => {
    setEditing(null);
    setCover("");
    form.reset({ title: "", description: "", client: "", industry: "", location: "", year: new Date().getFullYear(), category: "", liveUrl: "", githubUrl: "", status: "published", featured: false });
    setFormOpen(true);
  };

  const openEdit = (item: Project) => {
    setEditing(item);
    setCover(item.cover || "");
    setFormOpen(true);
  };

  const submit = async (data: ProjectForm) => {
    setSaving(true);
    try {
      const payload = { ...data, cover: cover || "", category: data.category || null };
      if (editing) {
        await api.patch(`/projects/${editing._id}`, payload);
        success("Project updated");
      } else {
        await api.post("/projects", payload);
        success("Project created");
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
        title="Projects"
        description="Manage your portfolio projects"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add project
          </Button>
        }
      />

      <AdminList
        resource="projects"
        searchPlaceholder="Search projects..."
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
        columns={[
          {
            key: "project",
            header: "Project",
            cell: (p) => (
              <div className="flex items-center gap-3">
                {p.cover ? (
                  <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <img src={resolveImageUrl(p.cover)} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-purple-500/10">
                    <FolderKanban className="h-5 w-5 text-purple-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.client || "Client"} · {p.year || "—"}</p>
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            cell: (p) => {
              const cat = p.category as Category | string | null | undefined;
              return <span className="text-sm text-slate-600 dark:text-slate-300">{typeof cat === "string" ? cat : cat?.name || "—"}</span>;
            },
          },
          {
            key: "status",
            header: "Status",
            cell: (p) => <Badge variant={p.status === "published" ? "success" : p.status === "draft" ? "warning" : "danger"}>{p.status}</Badge>,
          },
          {
            key: "featured",
            header: "Featured",
            cell: (p) => <Badge variant={p.featured ? "brand" : "neutral"}>{p.featured ? "Yes" : "No"}</Badge>,
          },
        ]}
      />

      <AdminModal<Project>
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit project" : "Add project"}
        description={editing ? `Updating ${editing.title}` : "Create a new portfolio project"}
        size="xl"
      >
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <ImageUpload value={cover} onChange={setCover} label="Cover image" />
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
          <Textarea label="Description" rows={4} error={form.formState.errors.description?.message} {...form.register("description")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Client" {...form.register("client")} />
            <Input label="Industry" {...form.register("industry")} />
            <Input label="Location" {...form.register("location")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Year" type="number" {...form.register("year")} />
            <Input label="Live URL" placeholder="https://..." {...form.register("liveUrl")} />
            <Input label="GitHub URL" placeholder="https://..." {...form.register("githubUrl")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <span className="block pb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <select className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700" {...form.register("status")}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2.5">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" {...form.register("featured")} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Create project"}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this project?"
        message={`This will permanently delete "${deleteTarget?.title}".`}
      />
    </div>
  );
}
