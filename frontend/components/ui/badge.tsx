import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "purple" | "cyan";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400",
  info: "bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400",
  neutral: "bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-300",
  brand: "bg-brand-500/10 text-brand-600 ring-brand-500/20 dark:text-brand-400",
  purple: "bg-purple-500/10 text-purple-600 ring-purple-500/20 dark:text-purple-400",
  cyan: "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:text-cyan-400",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusVariant(status: string): BadgeVariant {
  switch (status) {
    case "active":
    case "published":
    case "open":
    case "resolved":
    case "hired":
    case "success":
      return "success";
    case "inactive":
    case "draft":
    case "closed":
    case "rejected":
    case "archived":
    case "error":
      return "danger";
    case "pending":
    case "processing":
      return "warning";
    case "reviewing":
    case "shortlisted":
    case "warning":
      return "purple";
    case "info":
      return "info";
    default:
      return "neutral";
  }
}
