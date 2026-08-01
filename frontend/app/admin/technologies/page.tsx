"use client";

import { SimpleCrud, Badge } from "@/components/admin/simple-crud";
import { Cpu } from "lucide-react";
import type { Technology } from "@/types";

const techCategories = [
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Database", label: "Database" },
  { value: "DevOps", label: "DevOps" },
  { value: "Mobile", label: "Mobile" },
  { value: "AI", label: "AI" },
  { value: "Design", label: "Design" },
  { value: "Cloud", label: "Cloud" },
  { value: "Other", label: "Other" },
];

export default function AdminTechnologiesPage() {
  return (
    <SimpleCrud<Technology>
      resource="technologies"
      title="Technologies"
      description="Manage technologies and tools"
      itemTitle={(t) => t.name}
      searchPlaceholder="Search technologies..."
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "select", options: techCategories, defaultValue: "Other" },
        { name: "icon", label: "Icon URL", type: "text" },
        { name: "color", label: "Color", type: "text", defaultValue: "#4f46e5" },
        { name: "proficiency", label: "Proficiency (0-100)", type: "number", defaultValue: 80 },
        { name: "isActive", label: "Active", type: "checkbox", defaultValue: true },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      columns={[
        {
          key: "name",
          header: "Technology",
          cell: (t) => (
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${t.color || "#4f46e5"}1a`, color: t.color || "#4f46e5" }}
              >
                <Cpu className="h-4 w-4" />
              </div>
              <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
            </div>
          ),
        },
        {
          key: "category",
          header: "Category",
          cell: (t) => <Badge variant="purple">{t.category}</Badge>,
        },
        {
          key: "proficiency",
          header: "Proficiency",
          cell: (t) => (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${t.proficiency}%` }} />
              </div>
              <span className="text-xs text-slate-400">{t.proficiency}%</span>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (t) => <Badge variant={t.isActive ? "success" : "danger"}>{t.isActive ? "Active" : "Inactive"}</Badge>,
        },
      ]}
    />
  );
}
