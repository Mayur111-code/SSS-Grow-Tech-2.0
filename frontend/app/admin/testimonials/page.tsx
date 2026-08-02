"use client";

import { SimpleCrud, Badge } from "@/components/admin/simple-crud";
import { Star } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import type { Testimonial } from "@/types";

export default function AdminTestimonialsPage() {
  return (
    <SimpleCrud<Testimonial>
      resource="testimonials"
      title="Testimonials"
      description="Manage client testimonials"
      itemTitle={(t) => t.name}
      searchPlaceholder="Search testimonials..."
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "company", label: "Company", type: "text" },
        { name: "content", label: "Testimonial", type: "textarea", rows: 5, required: true, spanFull: true },
        { name: "rating", label: "Rating (1-5)", type: "number", defaultValue: 5 },
        { name: "avatar", label: "Avatar", type: "image" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ] },
        { name: "featured", label: "Featured", type: "checkbox" },
      ]}
      columns={[
        {
          key: "name",
          header: "Client",
          cell: (t) => (
            <div className="flex items-center gap-3">
              {t.avatar?.url ? (
                <img src={resolveImageUrl(t.avatar)} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-xs font-bold text-white">
                  {t.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.company}</p>
              </div>
            </div>
          ),
        },
        {
          key: "content",
          header: "Testimonial",
          cell: (t) => <p className="max-w-[300px] truncate text-sm text-slate-600 dark:text-slate-300">{t.content}</p>,
        },
        {
          key: "rating",
          header: "Rating",
          cell: (t) => (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
              ))}
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (t) => <Badge variant={t.status === "active" ? "success" : "danger"}>{t.status}</Badge>,
        },
      ]}
    />
  );
}
