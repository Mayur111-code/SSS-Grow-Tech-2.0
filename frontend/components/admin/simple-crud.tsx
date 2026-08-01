"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminList,
  useAdminResource,
  AdminPageHeader,
  AdminModal,
} from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Checkbox, Select } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import api, { getErrorMessage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import type { Column } from "@/components/ui/data-table";

type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "image";

interface FormField {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
  spanFull?: boolean;
  defaultValue?: unknown;
}

interface SimpleCrudProps<T extends { _id: string }> {
  resource: string;
  title: string;
  description?: string;
  columns: Column<T>[];
  fields: FormField[];
  defaults?: Record<string, unknown>;
  itemTitle: (item: T) => string;
  rowKey?: (item: T) => string;
  searchPlaceholder?: string;
}

export function SimpleCrud<T extends { _id: string }>({
  resource,
  title,
  description,
  columns,
  fields,
  defaults = {},
  itemTitle,
  rowKey,
  searchPlaceholder,
}: SimpleCrudProps<T>) {
  const { success, error } = useToast();
  const {
    editing, setEditing, deleteTarget, setDeleteTarget, deleteLoading, reload, handleToggle, handleDelete,
  } = useAdminResource<T>(resource);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState("");

  const initialValues = () => {
    const values: Record<string, unknown> = { ...defaults };
    fields.forEach((f) => {
      if (defaults[f.name] !== undefined) return;
      values[f.name] = f.defaultValue ?? "";
    });
    if (editing) {
      fields.forEach((f) => {
        const raw = (editing as unknown as Record<string, unknown>)[f.name];
        values[f.name] = raw ?? f.defaultValue ?? "";
      });
      const imgField = fields.find((f) => f.type === "image");
      if (imgField) {
        setImage(((editing as unknown as Record<string, unknown>)[imgField.name] as string) || "");
      }
    }
    return values;
  };

  const form = useForm({ defaultValues: initialValues() });

  const openCreate = () => {
    setEditing(null);
    setImage("");
    form.reset(initialValues());
    setFormOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    form.reset(initialValues());
    setFormOpen(true);
  };

  const submit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...data };
      fields.forEach((f) => {
        if (f.type === "checkbox") payload[f.name] = Boolean(data[f.name]);
        if (f.type === "number") payload[f.name] = data[f.name] === "" || data[f.name] === undefined ? undefined : Number(data[f.name]);
      });
      const imgField = fields.find((f) => f.type === "image");
      if (imgField) payload[imgField.name] = image;

      if (editing) {
        await api.patch(`/${resource}/${editing._id}`, payload);
        success("Updated successfully");
      } else {
        await api.post(`/${resource}`, payload);
        success("Created successfully");
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const currentImageValue = image || (editing as unknown as Record<string, unknown> | null)?.[fields.find((f) => f.type === "image")?.name || ""] as string | undefined;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <AdminList
        resource={resource}
        searchPlaceholder={searchPlaceholder || `Search ${title.toLowerCase()}...`}
        rowKey={rowKey}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onToggle={handleToggle}
        columns={columns}
      />

      <AdminModal<T>
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? `Edit ${title.toLowerCase().replace(/s$/, "")}` : `Add ${title.toLowerCase().replace(/s$/, "")}`}
        description={editing ? `Updating ${itemTitle(editing)}` : `Create a new ${title.toLowerCase().replace(/s$/, "")}`}
        size="lg"
      >
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          {fields.some((f) => f.type === "image") && (
            <div className="space-y-1.5">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                {fields.find((f) => f.type === "image")?.label}
              </span>
              <div className="space-y-3">
                {currentImageValue && (
                  <div className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <img src={resolveImageUrl(currentImageValue)} alt="preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-brand-500"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("image", file);
                      try {
                        const res = await api.post<{ data: { url: string } }>("/upload/image", formData, {
                          headers: { "Content-Type": "multipart/form-data" },
                        });
                        setImage(res.data.data.url);
                        success("Image uploaded");
                      } catch (err) {
                        error(getErrorMessage(err));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.filter((f) => f.type !== "image").map((field) => (
              <div key={field.name} className={field.spanFull ? "sm:col-span-2" : ""}>
                {field.type === "textarea" ? (
                  <Textarea
                    label={field.label}
                    rows={field.rows || 4}
                    placeholder={field.placeholder}
                    required={field.required}
                    {...form.register(field.name)}
                  />
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 pt-6">
                    <Checkbox {...form.register(field.name)} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{field.label}</span>
                  </label>
                ) : field.type === "select" ? (
                  <Select label={field.label} options={field.options} {...form.register(field.name)} />
                ) : field.type === "number" ? (
                  <Input label={field.label} type="number" placeholder={field.placeholder} {...form.register(field.name)} />
                ) : (
                  <Input label={field.label} placeholder={field.placeholder} {...form.register(field.name)} />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Create"}</Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title={`Delete this ${title.toLowerCase().replace(/s$/, "")}?`}
        message={`This will permanently delete "${deleteTarget ? itemTitle(deleteTarget) : ""}".`}
      />
    </div>
  );
}

export { Badge };
