"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";
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
import { resolveImageUrl, formatDate } from "@/lib/utils";
import { useAdminList } from "@/services/queries";
import type { Blog, Category, ImageRef } from "@/types";

const blogFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, "Content is required"),
  author: z.string().optional(),
  category: z.string().optional().nullable(),
  status: z.enum(["published", "draft"]),
  featured: z.boolean(),
});

type BlogForm = z.infer<typeof blogFormSchema>;

export default function AdminBlogsPage() {
  const { success, error } = useToast();
  const {
    editing, setEditing, deleteTarget, setDeleteTarget, deleteLoading, reload, handleToggle, handleDelete,
  } = useAdminResource<Blog>("blogs");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState<ImageRef | null>(null);
  const { data: categoriesData } = useAdminList<Category>("categories");
  const categories = categoriesData?.items || [];

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogFormSchema),
    values: {
      title: editing?.title || "",
      excerpt: editing?.excerpt || "",
      content: editing?.content || "",
      author: editing?.author || "",
      category: (editing?.category as Category | null | undefined)?._id || (editing?.category as string | null) || "",
      status: editing?.status || "published",
      featured: editing?.featured ?? false,
    },
  });

  const openCreate = () => {
    setEditing(null);
    setThumbnail(null);
    form.reset({ title: "", excerpt: "", content: "", author: "", category: "", status: "published", featured: false });
    setFormOpen(true);
  };

  const openEdit = (item: Blog) => {
    setEditing(item);
    setThumbnail(item.thumbnail || null);
    setFormOpen(true);
  };

  const submit = async (data: BlogForm) => {
    setSaving(true);
    try {
      const payload = { ...data, thumbnail, category: data.category || null };
      if (editing) {
        await api.patch(`/blogs/${editing._id}`, payload);
        success("Blog updated");
      } else {
        await api.post("/blogs", payload);
        success("Blog created");
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
        title="Blogs"
        description="Manage blog articles"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add blog
          </Button>
        }
      />

      <AdminList
        resource="blogs"
        searchPlaceholder="Search blogs..."
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
        columns={[
          {
            key: "post",
            header: "Post",
            cell: (b) => (
              <div className="flex items-center gap-3">
                {b.thumbnail?.url ? (
                  <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <img src={resolveImageUrl(b.thumbnail)} alt={b.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-emerald-500/10">
                    <FileText className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.author} · {formatDate(b.publishDate)}</p>
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            cell: (b) => {
              const cat = b.category as Category | string | null | undefined;
              return <span className="text-sm text-slate-600 dark:text-slate-300">{typeof cat === "string" ? cat : cat?.name || "—"}</span>;
            },
          },
          {
            key: "status",
            header: "Status",
            cell: (b) => <Badge variant={b.status === "published" ? "success" : "warning"}>{b.status}</Badge>,
          },
          {
            key: "featured",
            header: "Featured",
            cell: (b) => <Badge variant={b.featured ? "brand" : "neutral"}>{b.featured ? "Yes" : "No"}</Badge>,
          },
        ]}
      />

      <AdminModal<Blog>
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit blog" : "Add blog"}
        description={editing ? `Updating ${editing.title}` : "Create a new blog article"}
        size="xl"
      >
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <ImageUpload value={thumbnail} onChange={setThumbnail} label="Thumbnail" />
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
          <Textarea label="Excerpt" rows={2} {...form.register("excerpt")} />
          <Textarea label="Content" rows={8} error={form.formState.errors.content?.message} {...form.register("content")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Author" {...form.register("author")} />
            <div>
              <span className="block pb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <select className="w-full rounded-xl border border-slate-300 bg-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700" {...form.register("status")}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2.5">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" {...form.register("featured")} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Create blog"}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this blog?"
        message={`This will permanently delete "${deleteTarget?.title}".`}
      />
    </div>
  );
}
