"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
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
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminNotifications } from "@/services/queries";
import { cn } from "@/lib/utils";

const navGroups: { label: string; items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/blogs", label: "Blogs", icon: FileText },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/careers", label: "Careers", icon: Briefcase },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/technologies", label: "Technologies", icon: Cpu },
      { href: "/admin/categories", label: "Categories", icon: Tags },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/applications", label: "Applications", icon: ClipboardList },
      { href: "/admin/contacts", label: "Contacts", icon: MessageSquareText },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: notifications } = useAdminNotifications();

  const unread = notifications?.unread || 0;
  const activeItem = navGroups.flatMap((g) => g.items).find((i) => (i.exact ? pathname === i.href : pathname.startsWith(i.href)));

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090f]">
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-slate-200 bg-white/80 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-[#0a0a12]/80",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-6 p-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                          active
                            ? "text-brand-600 dark:text-brand-400"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="admin-active"
                            className="absolute inset-0 rounded-xl bg-brand-500/10"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <item.icon className="relative z-10 h-4 w-4" />
                        <span className="relative z-10">{item.label}</span>
                        {item.href === "/admin/contacts" && (
                          <Bell className="relative z-10 ml-auto h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Link
              href="/"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
            >
              <Globe className="h-4 w-4" /> View website
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/70 px-4 backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-[#09090f]/70">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                <span className="font-semibold text-brand-600 dark:text-brand-400">Admin</span>
                <span>/</span>
                <span className="truncate text-slate-600 dark:text-slate-300">{activeItem?.label || "Panel"}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {unread > 0 && (
                <Link
                  href="/dashboard/notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                </Link>
              )}
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
              >
                {theme === "dark" ? <span className="text-sm">☀️</span> : <span className="text-sm">🌙</span>}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
