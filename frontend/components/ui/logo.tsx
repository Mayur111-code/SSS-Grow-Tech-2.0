import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withText = true,
  size = "md",
  textClassName,
  glow = false,
}: {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  textClassName?: string;
  glow?: boolean;
}) {
  const dims = {
    sm: { box: "h-8 w-8", text: "text-base", img: 32 },
    md: { box: "h-10 w-10", text: "text-xl", img: 40 },
    lg: { box: "h-14 w-14", text: "text-3xl", img: 56 },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-xl bg-white/80 p-0.5 ring-1 ring-slate-200 dark:bg-white/10 dark:ring-white/10",
          dims.box,
          glow && "shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]"
        )}
      >
        <Image
          src="/sssgrow.jpg"
          alt="SSS Grow Tech"
          fill
          sizes={`${dims.img}px`}
          className="rounded-lg object-contain"
          priority
        />
      </div>
      {withText && (
        <span
          className={cn(
            "font-display font-bold tracking-tight text-slate-900 dark:text-white",
            dims.text,
            textClassName
          )}
        >
          SSS <span className="text-gradient">Grow Tech</span>
        </span>
      )}
    </div>
  );
}
