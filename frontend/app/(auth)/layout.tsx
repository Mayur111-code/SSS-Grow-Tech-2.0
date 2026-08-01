"use client";

import { Logo } from "@/components/ui/logo";
import { Particles } from "@/components/effects/particles";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mesh px-4 py-12">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px] animate-aurora" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-accent-600/20 blur-[120px] animate-aurora" />
      <Particles count={16} />

      <button
        onClick={toggleTheme}
        className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-600 backdrop-blur transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" glow />
        </div>
        <div className="gradient-border relative rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-card backdrop-blur-xl sm:p-10 dark:border-slate-800 dark:bg-[#0f101a]/80">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} SSS Grow Tech · sssgrowtech@gmail.com
        </p>
      </div>
    </div>
  );
}
