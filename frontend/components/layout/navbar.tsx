"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sun, Moon, LayoutDashboard, ShieldCheck, ChevronRight, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const mobileMenuTop = showAnnouncement
    ? "top-[calc(108px+env(safe-area-inset-top))]"
    : "top-[calc(72px+env(safe-area-inset-top))]";
  const mobileMenuMaxH = showAnnouncement
    ? "max-h-[calc(100dvh-130px-env(safe-area-inset-top))]"
    : "max-h-[calc(100dvh-92px-env(safe-area-inset-top))]";

  return (
    <>
      <ScrollProgress />

      {showAnnouncement && (
        <div
          className="relative z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 via-accent-600 to-pink-600 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <span className="hidden sm:inline">We&apos;re hiring! Check out our open positions</span>
          <span className="sm:hidden">Now hiring across India</span>
          <Link href="/careers" className="inline-flex items-center gap-0.5 underline underline-offset-2 hover:opacity-80">
            Apply now <ChevronRight className="h-3 w-3" />
          </Link>
          <button onClick={() => setShowAnnouncement(false)} className="absolute right-3 hover:opacity-80" aria-label="Dismiss announcement">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          showAnnouncement ? "mt-[calc(36px+env(safe-area-inset-top))]" : "mt-0"
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav
          className={cn(
            "relative mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8",
            scrolled
              ? "py-2.5"
              : "py-4"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 -z-10 transition-all duration-500",
              scrolled
                ? "mx-2 mt-1 rounded-2xl border border-slate-200/70 bg-white/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150 sm:mx-4 lg:mx-auto lg:max-w-6xl dark:border-white/10 dark:bg-[#0a0a12]/70"
                : "mx-0 border border-transparent bg-transparent"
            )}
          />

          <Link href="/" className="relative z-10 min-w-0 shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Logo textClassName="text-lg sm:text-xl" />
            </motion.div>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60",
                    active
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-brand-500/10 ring-1 ring-brand-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-3.5 right-3.5 h-px origin-left bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-300",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-600 backdrop-blur transition hover:border-brand-500 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 lg:flex">
                {user?.role === "admin" && (
                  <Magnetic>
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        <ShieldCheck className="h-4 w-4" /> Admin
                      </Button>
                    </Link>
                  </Magnetic>
                )}
                <Magnetic>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                </Magnetic>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Magnetic>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/contact">
                    <Button size="sm" className="btn-shine">
                      Start a Project <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-600 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-x-3 z-40 origin-top overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-[#0a0a12]/95 ${mobileMenuTop}`}
          >
            <div className={`overflow-y-auto p-5 ${mobileMenuMaxH}`}>
              <div className="space-y-1">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition",
                          active
                            ? "bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-600 dark:text-brand-400"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                        )}
                      >
                        {link.label}
                        <ArrowUpRight className={cn("h-4 w-4 transition", active ? "text-brand-500 opacity-100" : "opacity-30")} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-white/10"
              >
                {isAuthenticated ? (
                  <>
                    {user?.role === "admin" && (
                      <Link href="/admin">
                        <Button variant="outline" className="w-full">Admin Panel</Button>
                      </Link>
                    )}
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="danger" onClick={handleLogout} className="w-full">Logout</Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/contact">
                      <Button className="w-full btn-shine">Start a Project</Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
