"use client";

import { useEffect, useRef, useState } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiTailwindcss,
  SiFramer,
  SiGsap,
  SiRedux,
  SiDocker,
  SiGit,
  SiGithub,
  SiCloudinary,
  SiGooglecloud,
  SiVercel,
  SiRender,
  SiOpenaigym,
  SiGooglegemini,
  SiFigma,
  SiPostman,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { Cloud } from "lucide-react";
import { Reveal } from "@/hooks/use-animations";
import { useTechnologiesPublic } from "@/services/queries";
import type { Technology } from "@/types";

const COPIES = 4;
const GAP = 12;

const FALLBACK: Array<Omit<Technology, "_id">> = [
  { name: "React", slug: "react", category: "Frontend", icon: "", color: "", proficiency: 95, isActive: true, featured: true, sortOrder: 1 },
  { name: "Next.js", slug: "next-js", category: "Frontend", icon: "", color: "", proficiency: 95, isActive: true, featured: true, sortOrder: 2 },
  { name: "TypeScript", slug: "typescript", category: "Frontend", icon: "", color: "", proficiency: 94, isActive: true, featured: true, sortOrder: 3 },
  { name: "JavaScript", slug: "javascript", category: "Frontend", icon: "", color: "", proficiency: 96, isActive: true, featured: true, sortOrder: 4 },
  { name: "Tailwind CSS", slug: "tailwind-css", category: "Frontend", icon: "", color: "", proficiency: 96, isActive: true, featured: true, sortOrder: 5 },
  { name: "Framer Motion", slug: "framer-motion", category: "Frontend", icon: "", color: "", proficiency: 90, isActive: true, featured: false, sortOrder: 6 },
  { name: "GSAP", slug: "gsap", category: "Frontend", icon: "", color: "", proficiency: 88, isActive: true, featured: false, sortOrder: 7 },
  { name: "Redux", slug: "redux", category: "Frontend", icon: "", color: "", proficiency: 87, isActive: true, featured: false, sortOrder: 8 },
  { name: "Node.js", slug: "node-js", category: "Backend", icon: "", color: "", proficiency: 92, isActive: true, featured: true, sortOrder: 9 },
  { name: "Express.js", slug: "express-js", category: "Backend", icon: "", color: "", proficiency: 90, isActive: true, featured: false, sortOrder: 10 },
  { name: "MongoDB", slug: "mongodb", category: "Database", icon: "", color: "", proficiency: 90, isActive: true, featured: true, sortOrder: 11 },
  { name: "PostgreSQL", slug: "postgresql", category: "Database", icon: "", color: "", proficiency: 86, isActive: true, featured: false, sortOrder: 12 },
  { name: "Firebase", slug: "firebase", category: "Cloud", icon: "", color: "", proficiency: 84, isActive: true, featured: false, sortOrder: 13 },
  { name: "Docker", slug: "docker", category: "DevOps", icon: "", color: "", proficiency: 82, isActive: true, featured: false, sortOrder: 14 },
  { name: "Git", slug: "git", category: "DevOps", icon: "", color: "", proficiency: 93, isActive: true, featured: false, sortOrder: 15 },
  { name: "GitHub", slug: "github", category: "DevOps", icon: "", color: "", proficiency: 91, isActive: true, featured: false, sortOrder: 16 },
  { name: "AWS", slug: "aws", category: "Cloud", icon: "", color: "", proficiency: 82, isActive: true, featured: true, sortOrder: 17 },
  { name: "Cloudinary", slug: "cloudinary", category: "Cloud", icon: "", color: "", proficiency: 85, isActive: true, featured: false, sortOrder: 18 },
  { name: "Google Cloud", slug: "google-cloud", category: "Cloud", icon: "", color: "", proficiency: 80, isActive: true, featured: false, sortOrder: 19 },
  { name: "OpenAI", slug: "openai", category: "AI", icon: "", color: "", proficiency: 88, isActive: true, featured: true, sortOrder: 20 },
  { name: "Gemini", slug: "gemini", category: "AI", icon: "", color: "", proficiency: 86, isActive: true, featured: false, sortOrder: 21 },
  { name: "Vercel", slug: "vercel", category: "Cloud", icon: "", color: "", proficiency: 85, isActive: true, featured: false, sortOrder: 22 },
  { name: "Render", slug: "render", category: "Cloud", icon: "", color: "", proficiency: 80, isActive: true, featured: false, sortOrder: 23 },
  { name: "Figma", slug: "figma", category: "Design", icon: "", color: "", proficiency: 89, isActive: true, featured: false, sortOrder: 24 },
  { name: "Postman", slug: "postman", category: "DevOps", icon: "", color: "", proficiency: 87, isActive: true, featured: false, sortOrder: 25 },
];

const BRAND_ICONS: Record<string, IconType> = {
  react: SiReact,
  "next-js": SiNextdotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  "node-js": SiNodedotjs,
  express: SiExpress,
  "express-js": SiExpress,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  firebase: SiFirebase,
  "tailwind-css": SiTailwindcss,
  "framer-motion": SiFramer,
  gsap: SiGsap,
  redux: SiRedux,
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  aws: Cloud,
  cloudinary: SiCloudinary,
  "google-cloud": SiGooglecloud,
  openai: SiOpenaigym,
  gemini: SiGooglegemini,
  vercel: SiVercel,
  render: SiRender,
  figma: SiFigma,
  postman: SiPostman,
};

const BRAND_COLORS: Record<string, string> = {
  react: "#61dafb",
  "next-js": "#94a3b8",
  typescript: "#3178c6",
  javascript: "#f7df1e",
  "node-js": "#339933",
  express: "#94a3b8",
  "express-js": "#94a3b8",
  mongodb: "#47a248",
  postgresql: "#4169e1",
  firebase: "#ffca28",
  "tailwind-css": "#06b6d4",
  "framer-motion": "#0055ff",
  gsap: "#88ce02",
  redux: "#764abc",
  docker: "#2496ed",
  git: "#f05032",
  github: "#a78bfa",
  aws: "#ff9900",
  cloudinary: "#3448c5",
  "google-cloud": "#4285f4",
  openai: "#10a37f",
  gemini: "#9c9efd",
  vercel: "#94a3b8",
  render: "#46e3b7",
  figma: "#f24e1e",
  postman: "#ff6c37",
};

function getTransformX(el: HTMLElement): number {
  const t = window.getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  return new DOMMatrix(t).e;
}

function TechLogo({ tech, className }: { tech: Technology; className?: string }) {
  const slug = (tech.slug || "").toLowerCase();
  if (/^(https?:)?\/\//i.test(tech.icon) || tech.icon.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={tech.icon} alt={tech.name} draggable={false} className={`${className} object-contain`} />
    );
  }
  const BrandIcon = BRAND_ICONS[slug];
  if (BrandIcon) return <BrandIcon className={className} aria-hidden />;
  const initials = tech.name.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase() || "T";
  return <span className={`${className} font-display font-bold`}>{initials}</span>;
}

function TechPill({ tech }: { tech: Technology }) {
  const slug = (tech.slug || "").toLowerCase();
  const color = tech.color || BRAND_COLORS[slug] || "#6366f1";

  return (
    <article className="group/card relative shrink-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[3px] rounded-2xl bg-gradient-to-r from-brand-500/50 via-accent-500/50 to-brand-500/50 opacity-0 blur-[7px] transition-opacity duration-300 group-hover/card:opacity-90"
      />
      <div className="glass-panel relative flex w-[100px] items-center gap-2 rounded-2xl px-2.5 py-2 transition-all duration-300 ease-out group-hover/card:-translate-y-0.5 group-hover/card:border-brand-500/50 group-hover/card:shadow-[0_14px_30px_-12px_rgba(99,102,241,0.45)] sm:w-[130px] sm:px-3 sm:py-2.5 md:w-[145px]">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10"
          style={{ background: `${color}1f`, color, border: `1px solid ${color}33` }}
        >
          <TechLogo tech={tech} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">{tech.name}</span>
          <span className="block truncate text-[9px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {tech.category || "Tech"}
          </span>
        </span>
      </div>
    </article>
  );
}

interface MarqueeRowProps {
  items: Technology[];
  direction: "left" | "right";
  duration: number;
}

function MarqueeRow({ items, direction, duration }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, baseX: 0 });
  const [groupWidth, setGroupWidth] = useState(0);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const update = () => setGroupWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, baseX: getTransformX(el) };
    el.style.animationPlayState = "paused";
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    el.style.setProperty("transform", `translateX(${drag.current.baseX + dx}px)`, "important");
  };

  const endDrag = () => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const current = getTransformX(el);
    el.style.removeProperty("transform");
    if (groupWidth > 0) {
      const range = groupWidth * 2;
      const elapsed = direction === "left" ? (-current / range) * duration : (1 + current / range) * duration;
      el.style.animationDelay = `-${Math.max(0, elapsed % duration)}s`;
    }
    el.style.animationPlayState = "";
    drag.current.active = false;
  };

  const group = (key: number) => (
    <div ref={key === 0 ? groupRef : undefined} key={key} className="flex shrink-0 items-center pr-3" style={{ gap: GAP }}>
      {items.map((tech) => (
        <TechPill key={tech._id} tech={tech} />
      ))}
    </div>
  );

  return (
    <div className="marquee-row mask-fade-x overflow-hidden">
      <div
        ref={trackRef}
        className="marquee-track flex w-max items-center"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {Array.from({ length: COPIES }, (_, i) => group(i))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  const { data } = useTechnologiesPublic();
  const rawItems = data?.items || [];

  const items: Technology[] =
    rawItems.length > 0
      ? rawItems
      : FALLBACK.map((tech, i) => ({
          _id: `fallback-${i}`,
          ...tech,
        }));

  const baseDuration = Math.max(30, items.length * 2.6);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Technology Stack</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          Powering innovation with the latest tools
        </h2>
      </Reveal>
      <div className="relative mt-12 space-y-4">
        <MarqueeRow items={items} direction="left" duration={baseDuration} />
        <MarqueeRow items={items} direction="right" duration={baseDuration * 1.35} />
      </div>
    </section>
  );
}
