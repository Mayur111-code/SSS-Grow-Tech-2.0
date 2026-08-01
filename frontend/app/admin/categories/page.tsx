"use client";

import { SimpleCrud, Badge } from "@/components/admin/simple-crud";
import { Tags } from "lucide-react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  return (
    <SimpleCrud<Category>
      resource="categories"
      title="Categories"
      description="Manage categories"
      itemTitle={(c) => c.name}
      searchPlaceholder="Search categories..."
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", rows: 3, spanFull: true },
        { name: "type", label: "Type", type: "select", options: [
          { value: "service", label: "Service" },
          { value: "project", label: "Project" },
          { value: "blog", label: "Blog" },
          { value: "general", label: "General" },
        ], defaultValue: "general" },
        { name: "icon", label: "Icon", type: "text" },
        { name: "color", label: "Color", type: "text", defaultValue: "#4f46e5" },
        { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      columns={[
        {
          key: "name",
          header: "Category",
          cell: (c) => (
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${c.color || "#4f46e5"}1a`, color: c.color || "#4f46e5" }}
              >
                <Tags className="h-4 w-4" />
              </div>
              <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
            </div>
          ),
        },
        {
          key: "type",
          header: "Type",
          cell: (c) => <Badge variant="cyan">{c.type}</Badge>,
        },
        {
          key: "status",
          header: "Status",
          cell: (c) => <Badge variant={c.isActive ? "success" : "danger"}>{c.isActive ? "Active" : "Inactive"}</Badge>,
        },
      ]}
    />
  );
}
