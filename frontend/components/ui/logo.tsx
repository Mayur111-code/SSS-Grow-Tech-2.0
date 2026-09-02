import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export function Logo({
  className,
  withText = true,
  size = "md",
  textClassName,
  glow = false,
  src,
}: {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  textClassName?: string;
  glow?: boolean;
  src?: string;
}) {
  const { logo, siteName } = useSiteSettings();
  const logoUrl = src || logo;

  const words = siteName.trim().split(/\s+/);
  const first = words.length > 1 ? `${words.slice(0, -1).join(" ")} ` : "";

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
          src={logoUrl}
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
          {first}
          <span className="text-gradient">{words[words.length - 1]}</span>
        </span>
      )}
    </div>
  );
}
