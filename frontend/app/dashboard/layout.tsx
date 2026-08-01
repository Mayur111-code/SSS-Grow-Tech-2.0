"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  MessageSquareText,
  Briefcase,
  Bookmark,
  Bell,
  LogOut,
  Menu,
  X,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminNotifications } from "@/services/queries";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Profile", icon: User },
  { href: "/dashboard/contacts", label: "Contact Requests", icon: MessageSquareText },
  { href: "/dashboard/applications", label: "Career Applications", icon: Briefcase },
  { href: "/dashboard/saved-projects", label: "Saved Projects", icon: Bookmark },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: notifications } = useAdminNotifications();

  const unread = notifications?.unread || 0;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090f]">
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white/80 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-[#0a0a12]/80",
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

          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="dashboard-active"
                      className="absolute inset-0 rounded-xl bg-brand-500/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{item.label}</span>
                  {item.href === "/dashboard/notifications" && unread > 0 && (
                    <span className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
              >
                <Globe className="h-4 w-4" /> Back to website
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                  <ShieldCheck className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/70 px-4 backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-[#09090f]/70">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-brand-500">Home</Link>
              <span>/</span>
              <span className="text-slate-600 dark:text-slate-300">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
              >
                {theme === "dark" ? (
                  <span className="text-sm">☀️</span>
                ) : (
                  <span className="text-sm">🌙</span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
