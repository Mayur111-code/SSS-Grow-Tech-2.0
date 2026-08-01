"use client";

import { SimpleCrud, Badge } from "@/components/admin/simple-crud";
import { HelpCircle } from "lucide-react";
import type { FAQ } from "@/types";

export default function AdminFaqsPage() {
  return (
    <SimpleCrud<FAQ>
      resource="faqs"
      title="FAQs"
      description="Manage frequently asked questions"
      itemTitle={(f) => f.question}
      searchPlaceholder="Search FAQs..."
      fields={[
        { name: "question", label: "Question", type: "text", required: true, spanFull: true },
        { name: "answer", label: "Answer", type: "textarea", rows: 5, required: true, spanFull: true },
        { name: "category", label: "Category", type: "text", defaultValue: "General" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ] },
        { name: "sortOrder", label: "Sort order", type: "number" },
      ]}
      columns={[
        {
          key: "question",
          header: "Question",
          cell: (f) => (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                <HelpCircle className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="max-w-[400px] truncate font-medium text-slate-900 dark:text-white">{f.question}</p>
            </div>
          ),
        },
        {
          key: "category",
          header: "Category",
          cell: (f) => <span className="text-sm text-slate-600 dark:text-slate-300">{f.category}</span>,
        },
        {
          key: "status",
          header: "Status",
          cell: (f) => <Badge variant={f.status === "active" ? "success" : "danger"}>{f.status}</Badge>,
        },
      ]}
    />
  );
}
