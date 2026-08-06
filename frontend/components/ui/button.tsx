import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  magnetic?: boolean;
  children: ReactNode;
}

const variants: Record<string, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_30px_-8px_rgba(99,102,241,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.8)]",
  gradient:
    "text-white bg-gradient-to-r from-brand-600 via-accent-600 to-pink-600 bg-[length:200%_auto] hover:bg-right shadow-[0_8px_30px_-8px_rgba(139,92,246,0.6)] transition-[background-position] duration-500",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  outline:
    "border border-slate-300 text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300 bg-transparent",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 bg-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-[0_8px_30px_-8px_rgba(239,68,68,0.6)]",
};

const sizes: Record<string, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-11 w-11",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  magnetic,
  children,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!magnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = (magnetic ? motion.button : motion.button) as React.ComponentType<Record<string, unknown>>;

  return (
    <Comp
      style={{ x: magnetic ? springX : 0, y: magnetic ? springY : 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;
        onClick?.(e);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  );
}
