"use client";

import { SimpleCrud, Badge } from "@/components/admin/simple-crud";
import type { Career } from "@/types";

export default function AdminCareersPage() {
  return (
    <SimpleCrud<Career>
      resource="careers"
      title="Careers"
      description="Manage job openings"
      itemTitle={(c) => c.title}
      searchPlaceholder="Search jobs..."
      fields={[
        { name: "title", label: "Job title", type: "text", required: true, spanFull: true },
        { name: "department", label: "Department", type: "text" },
        { name: "type", label: "Employment type", type: "select", options: [
          { value: "full-time", label: "Full-time" },
          { value: "part-time", label: "Part-time" },
          { value: "contract", label: "Contract" },
          { value: "internship", label: "Internship" },
          { value: "freelance", label: "Freelance" },
          { value: "remote", label: "Remote" },
        ] },
        { name: "location", label: "Location", type: "text" },
        { name: "experience", label: "Experience", type: "text" },
        { name: "salary", label: "Salary", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 6, required: true, spanFull: true },
        { name: "status", label: "Status", type: "select", options: [
          { value: "open", label: "Open" },
          { value: "closed", label: "Closed" },
        ] },
        { name: "featured", label: "Featured", type: "checkbox" },
      ]}
      columns={[
        {
          key: "title",
          header: "Position",
          cell: (c) => (
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{c.title}</p>
              <p className="text-xs text-slate-400">{c.department}</p>
            </div>
          ),
        },
        {
          key: "type",
          header: "Type",
          cell: (c) => <Badge variant="info">{c.type}</Badge>,
        },
        {
          key: "location",
          header: "Location",
          cell: (c) => <span className="text-sm text-slate-600 dark:text-slate-300">{c.location}</span>,
        },
        {
          key: "salary",
          header: "Salary",
          cell: (c) => <span className="text-sm text-slate-600 dark:text-slate-300">{c.salary || "—"}</span>,
        },
        {
          key: "status",
          header: "Status",
          cell: (c) => <Badge variant={c.status === "open" ? "success" : "danger"}>{c.status}</Badge>,
        },
      ]}
    />
  );
}
