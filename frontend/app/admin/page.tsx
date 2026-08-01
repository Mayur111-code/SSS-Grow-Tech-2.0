"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Wrench,
  FolderKanban,
  FileText,
  Star,
  Briefcase,
  ClipboardList,
  MessageSquareText,
  HelpCircle,
  Cpu,
  Tags,
  TrendingUp,
} from "lucide-react";
import { useAdminStats } from "@/services/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { Application, Contact } from "@/types";

const statCards = [
  { key: "users", label: "Users", icon: Users, href: "/admin/users", color: "text-sky-500 bg-sky-500/10" },
  { key: "services", label: "Services", icon: Wrench, href: "/admin/services", color: "text-brand-500 bg-brand-500/10" },
  { key: "projects", label: "Projects", icon: FolderKanban, href: "/admin/projects", color: "text-purple-500 bg-purple-500/10" },
  { key: "blogs", label: "Blogs", icon: FileText, href: "/admin/blogs", color: "text-emerald-500 bg-emerald-500/10" },
  { key: "testimonials", label: "Testimonials", icon: Star, href: "/admin/testimonials", color: "text-amber-500 bg-amber-500/10" },
  { key: "careers", label: "Careers", icon: Briefcase, href: "/admin/careers", color: "text-cyan-500 bg-cyan-500/10" },
  { key: "applications", label: "Applications", icon: ClipboardList, href: "/admin/applications", color: "text-rose-500 bg-rose-500/10" },
  { key: "contacts", label: "Contacts", icon: MessageSquareText, href: "/admin/contacts", color: "text-teal-500 bg-teal-500/10" },
  { key: "faqs", label: "FAQs", icon: HelpCircle, href: "/admin/faqs", color: "text-indigo-500 bg-indigo-500/10" },
  { key: "technologies", label: "Technologies", icon: Cpu, href: "/admin/technologies", color: "text-fuchsia-500 bg-fuchsia-500/10" },
  { key: "categories", label: "Categories", icon: Tags, href: "/admin/categories", color: "text-orange-500 bg-orange-500/10" },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();

  const recentContacts: Contact[] = data?.recentContacts || [];
  const recentApplications: Application[] = data?.recentApplications || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of your platform activity</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-4 w-4" /> All systems operational
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={stat.href}
              className="group block rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg dark:border-slate-800 dark:bg-[#0f101a]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? <Skeleton className="h-7 w-10" /> : data?.counts?.[stat.key as keyof typeof data.counts] ?? 0}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Recent contacts</h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : recentContacts.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No contacts yet</p>
            ) : (
              recentContacts.map((contact) => (
                <div key={contact._id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{contact.subject}</p>
                    <p className="truncate text-xs text-slate-400">
                      {contact.name} · {contact.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={statusVariant(contact.status)}>{contact.status}</Badge>
                    <span className="hidden text-xs text-slate-400 sm:block">{formatDateTime(contact.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Recent applications</h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : recentApplications.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No applications yet</p>
            ) : (
              recentApplications.map((app) => {
                const career = app.career as unknown as { title?: string } | undefined;
                return (
                  <div key={app._id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{app.name}</p>
                      <p className="truncate text-xs text-slate-400">{career?.title || "Position"} · {app.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
