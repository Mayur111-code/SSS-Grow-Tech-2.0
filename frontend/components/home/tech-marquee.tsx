// "use client";

// import { useEffect, useRef, useState } from "react";
// import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
// import { Reveal } from "@/hooks/use-animations";
// import { useTechnologiesPublic } from "@/services/queries";
// import type { Technology } from "@/types";

// const COPIES = 4;
// const BASE_GAP = 16;

// const FALLBACK: Array<Omit<Technology, "_id">> = [
//   { name: "React", slug: "react", category: "Frontend", icon: "", color: "#61dafb", proficiency: 95, isActive: true, featured: true, sortOrder: 1 },
//   { name: "Next.js", slug: "next-js", category: "Frontend", icon: "", color: "#667eea", proficiency: 95, isActive: true, featured: true, sortOrder: 2 },
//   { name: "TypeScript", slug: "typescript", category: "Frontend", icon: "", color: "#3178c6", proficiency: 94, isActive: true, featured: true, sortOrder: 3 },
//   { name: "JavaScript", slug: "javascript", category: "Frontend", icon: "", color: "#f7df1e", proficiency: 96, isActive: true, featured: true, sortOrder: 4 },
//   { name: "Tailwind CSS", slug: "tailwind-css", category: "Frontend", icon: "", color: "#06b6d4", proficiency: 96, isActive: true, featured: true, sortOrder: 5 },
//   { name: "Framer Motion", slug: "framer-motion", category: "Frontend", icon: "", color: "#e34f26", proficiency: 90, isActive: true, featured: false, sortOrder: 6 },
//   { name: "GSAP", slug: "gsap", category: "Frontend", icon: "", color: "#88ce02", proficiency: 88, isActive: true, featured: false, sortOrder: 7 },
//   { name: "Redux", slug: "redux", category: "Frontend", icon: "", color: "#764abc", proficiency: 87, isActive: true, featured: false, sortOrder: 8 },
//   { name: "Node.js", slug: "node-js", category: "Backend", icon: "", color: "#339933", proficiency: 92, isActive: true, featured: true, sortOrder: 9 },
//   { name: "Express.js", slug: "express-js", category: "Backend", icon: "", color: "#8f8f8f", proficiency: 90, isActive: true, featured: false, sortOrder: 10 },
//   { name: "Python", slug: "python", category: "Backend", icon: "", color: "#3776ab", proficiency: 88, isActive: true, featured: false, sortOrder: 11 },
//   { name: "MongoDB", slug: "mongodb", category: "Database", icon: "", color: "#47a248", proficiency: 90, isActive: true, featured: true, sortOrder: 12 },
//   { name: "PostgreSQL", slug: "postgresql", category: "Database", icon: "", color: "#4169e1", proficiency: 86, isActive: true, featured: false, sortOrder: 13 },
//   { name: "Firebase", slug: "firebase", category: "Cloud", icon: "", color: "#ffca28", proficiency: 84, isActive: true, featured: false, sortOrder: 14 },
//   { name: "Docker", slug: "docker", category: "DevOps", icon: "", color: "#2496ed", proficiency: 82, isActive: true, featured: false, sortOrder: 15 },
//   { name: "Git", slug: "git", category: "DevOps", icon: "", color: "#f05033", proficiency: 93, isActive: true, featured: false, sortOrder: 16 },
//   { name: "GitHub", slug: "github", category: "DevOps", icon: "", color: "#8b5cf6", proficiency: 91, isActive: true, featured: false, sortOrder: 17 },
//   { name: "AWS", slug: "aws", category: "Cloud", icon: "", color: "#ff9900", proficiency: 82, isActive: true, featured: true, sortOrder: 18 },
//   { name: "Cloudinary", slug: "cloudinary", category: "Cloud", icon: "", color: "#3448c5", proficiency: 85, isActive: true, featured: false, sortOrder: 19 },
//   { name: "Google Cloud", slug: "google-cloud", category: "Cloud", icon: "", color: "#4285f4", proficiency: 80, isActive: true, featured: false, sortOrder: 20 },
//   { name: "OpenAI", slug: "openai", category: "AI", icon: "", color: "#10a37f", proficiency: 88, isActive: true, featured: true, sortOrder: 21 },
//   { name: "Gemini", slug: "gemini", category: "AI", icon: "", color: "#e879f9", proficiency: 86, isActive: true, featured: false, sortOrder: 22 },
//   { name: "Vercel", slug: "vercel", category: "Cloud", icon: "", color: "#a1a1aa", proficiency: 85, isActive: true, featured: false, sortOrder: 23 },
//   { name: "Render", slug: "render", category: "Cloud", icon: "", color: "#46e3b7", proficiency: 80, isActive: true, featured: false, sortOrder: 24 },
//   { name: "Figma", slug: "figma", category: "Design", icon: "", color: "#f24e1e", proficiency: 89, isActive: true, featured: false, sortOrder: 25 },
//   { name: "Postman", slug: "postman", category: "DevOps", icon: "", color: "#ff6c37", proficiency: 87, isActive: true, featured: false, sortOrder: 26 },
// ];

// interface MarqueeRowProps {
//   items: Technology[];
//   direction: "left" | "right";
//   speed: number;
// }

// function TechLogo({ tech, className }: { tech: Technology; className?: string }) {
//   const isUrl = /^(https?:)?\/\//i.test(tech.icon) || tech.icon.startsWith("/");
//   if (isUrl) {
//     return (
//       // eslint-disable-next-line @next/next/no-img-element
//       <img src={tech.icon} alt={tech.name} draggable={false} className={`${className} object-contain`} />
//     );
//   }
//   const initials = tech.name.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase() || "T";
//   return <span className={`${className} font-display font-bold`}>{initials}</span>;
// }

// function TechCard({ tech }: { tech: Technology }) {
//   const color = tech.color || "#6366f1";
//   return (
//     <article className="group/card relative shrink-0">
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-lg transition-opacity duration-300 group-hover/card:opacity-70"
//         style={{ background: `radial-gradient(60% 60% at 50% 50%, ${color}59, transparent 70%)` }}
//       />
//       <div className="glass-panel relative flex w-[140px] flex-col items-center gap-2 rounded-2xl px-4 py-4 transition-transform duration-[250ms] ease-out will-change-transform group-hover/card:scale-[1.06] sm:w-[170px] sm:py-5 md:w-[190px]">
//         <div
//           className="flex h-11 w-11 items-center justify-center rounded-xl sm:h-14 sm:w-14"
//           style={{
//             background: `linear-gradient(135deg, ${color}2e, ${color}0d)`,
//             border: `1px solid ${color}40`,
//             color,
//           }}
//         >
//           <TechLogo tech={tech} className="h-6 w-6 sm:h-7 sm:w-7" />
//         </div>
//         <span className="text-sm font-semibold text-slate-800 sm:text-[15px] dark:text-slate-100">{tech.name}</span>
//         <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-[11px] dark:text-slate-400">
//           {tech.category || "Tech"}
//         </span>
//       </div>
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 rounded-2xl border-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
//         style={{ borderColor: `${color}66` }}
//       />
//     </article>
//   );
// }

// function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
//   const groupRef = useRef<HTMLDivElement>(null);
//   const [groupWidth, setGroupWidth] = useState(0);
//   const baseX = useMotionValue(0);
//   const x = useMotionValue(0);
//   const pausedRef = useRef(false);
//   const draggingRef = useRef(false);
//   const pointer = useRef({ active: false, startX: 0, startBase: 0 });

//   useEffect(() => {
//     const el = groupRef.current;
//     if (!el) return;
//     const update = () => setGroupWidth(el.offsetWidth);
//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   useAnimationFrame((_, delta) => {
//     if (pausedRef.current || draggingRef.current || !groupWidth) return;
//     const move = (speed * delta) / 1000;
//     const next = (baseX.get() + (direction === "left" ? -move : move)) % groupWidth;
//     x.set(next > 0 ? next - groupWidth : next);
//   });

//   const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
//     draggingRef.current = true;
//     pointer.current = { active: true, startX: e.clientX, startBase: baseX.get() };
//     e.currentTarget.setPointerCapture(e.pointerId);
//   };

//   const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!pointer.current.active) return;
//     baseX.set(pointer.current.startBase + (e.clientX - pointer.current.startX));
//   };

//   const endDrag = () => {
//     pointer.current.active = false;
//     draggingRef.current = false;
//   };

//   const group = (key: number) => (
//     <div ref={key === 0 ? groupRef : undefined} key={key} className="flex shrink-0 items-center pr-4" style={{ gap: BASE_GAP }}>
//       {items.map((tech) => (
//         <TechCard key={tech._id} tech={tech} />
//       ))}
//     </div>
//   );

//   return (
//     <div
//       className="mask-fade-x overflow-hidden"
//       onPointerEnter={() => {
//         pausedRef.current = true;
//       }}
//       onPointerLeave={() => {
//         pausedRef.current = false;
//       }}
//     >
//       <motion.div
//         className="flex w-max items-center will-change-transform"
//         style={{ x, touchAction: "pan-y" }}
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={endDrag}
//         onPointerCancel={endDrag}
//       >
//         {Array.from({ length: COPIES }, (_, i) => group(i))}
//       </motion.div>
//     </div>
//   );
// }

// export function TechMarquee() {
//   const { data } = useTechnologiesPublic();
//   const rawItems = data?.items || [];

//   const items: Technology[] =
//     rawItems.length > 0
//       ? rawItems
//       : FALLBACK.map((tech, i) => ({
//           _id: `fallback-${i}`,
//           ...tech,
//         }));

//   return (
//     <section className="relative overflow-hidden py-14">
//       <Reveal className="mx-auto max-w-2xl px-4 text-center">
//         <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Technology Stack</p>
//         <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
//           Powering innovation with the latest tools
//         </h2>
//       </Reveal>
//       <div className="relative mt-10 space-y-4">
//         <MarqueeRow items={items} direction="right" speed={55} />
//         <MarqueeRow items={items} direction="left" speed={45} />
//       </div>
//     </section>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { Reveal } from "@/hooks/use-animations";
import { useTechnologiesPublic } from "@/services/queries";
import type { Technology } from "@/types";

const COPIES = 4;
const BASE_GAP = 16;

const FALLBACK: Array<Omit<Technology, "_id">> = [
  {
    name: "React",
    slug: "react",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg",
    color: "#61dafb",
    proficiency: 95,
    isActive: true,
    featured: true,
    sortOrder: 1,
  },
  {
    name: "Next.js",
    slug: "next-js",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nextdotjs.svg",
    color: "#667eea",
    proficiency: 95,
    isActive: true,
    featured: true,
    sortOrder: 2,
  },
  {
    name: "TypeScript",
    slug: "typescript",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg",
    color: "#3178c6",
    proficiency: 94,
    isActive: true,
    featured: true,
    sortOrder: 3,
  },
  {
    name: "JavaScript",
    slug: "javascript",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg",
    color: "#f7df1e",
    proficiency: 96,
    isActive: true,
    featured: true,
    sortOrder: 4,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tailwindcss.svg",
    color: "#06b6d4",
    proficiency: 96,
    isActive: true,
    featured: true,
    sortOrder: 5,
  },
  {
    name: "Framer Motion",
    slug: "framer-motion",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/framer.svg",
    color: "#e34f26",
    proficiency: 90,
    isActive: true,
    featured: false,
    sortOrder: 6,
  },
  {
    name: "GSAP",
    slug: "gsap",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gsap.svg",
    color: "#88ce02",
    proficiency: 88,
    isActive: true,
    featured: false,
    sortOrder: 7,
  },
  {
    name: "Redux",
    slug: "redux",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/redux.svg",
    color: "#764abc",
    proficiency: 87,
    isActive: true,
    featured: false,
    sortOrder: 8,
  },
  {
    name: "Node.js",
    slug: "node-js",
    category: "Backend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg",
    color: "#339933",
    proficiency: 92,
    isActive: true,
    featured: true,
    sortOrder: 9,
  },
  {
    name: "Express.js",
    slug: "express-js",
    category: "Backend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/express.svg",
    color: "#8f8f8f",
    proficiency: 90,
    isActive: true,
    featured: false,
    sortOrder: 10,
  },
  {
    name: "Python",
    slug: "python",
    category: "Backend",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg",
    color: "#3776ab",
    proficiency: 88,
    isActive: true,
    featured: false,
    sortOrder: 11,
  },
  {
    name: "MongoDB",
    slug: "mongodb",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mongodb.svg",
    color: "#47a248",
    proficiency: 90,
    isActive: true,
    featured: true,
    sortOrder: 12,
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/postgresql.svg",
    color: "#4169e1",
    proficiency: 86,
    isActive: true,
    featured: false,
    sortOrder: 13,
  },
  {
    name: "Firebase",
    slug: "firebase",
    category: "Cloud",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/firebase.svg",
    color: "#ffca28",
    proficiency: 84,
    isActive: true,
    featured: false,
    sortOrder: 14,
  },
  {
    name: "Docker",
    slug: "docker",
    category: "DevOps",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg",
    color: "#2496ed",
    proficiency: 82,
    isActive: true,
    featured: false,
    sortOrder: 15,
  },
  {
    name: "Git",
    slug: "git",
    category: "DevOps",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg",
    color: "#f05033",
    proficiency: 93,
    isActive: true,
    featured: false,
    sortOrder: 16,
  },
  {
    name: "GitHub",
    slug: "github",
    category: "DevOps",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    color: "#8b5cf6",
    proficiency: 91,
    isActive: true,
    featured: false,
    sortOrder: 17,
  },
  {
    name: "AWS",
    slug: "aws",
    category: "Cloud",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonwebservices.svg",
    color: "#ff9900",
    proficiency: 82,
    isActive: true,
    featured: true,
    sortOrder: 18,
  },
  {
    name: "Cloudinary",
    slug: "cloudinary",
    category: "Cloud",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cloudinary.svg",
    color: "#3448c5",
    proficiency: 85,
    isActive: true,
    featured: false,
    sortOrder: 19,
  },
  {
    name: "Google Cloud",
    slug: "google-cloud",
    category: "Cloud",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlecloud.svg",
    color: "#4285f4",
    proficiency: 80,
    isActive: true,
    featured: false,
    sortOrder: 20,
  },
  {
    name: "OpenAI",
    slug: "openai",
    category: "AI",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openai.svg",
    color: "#10a37f",
    proficiency: 88,
    isActive: true,
    featured: true,
    sortOrder: 21,
  },
  {
    name: "Gemini",
    slug: "gemini",
    category: "AI",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg",
    color: "#e879f9",
    proficiency: 86,
    isActive: true,
    featured: false,
    sortOrder: 22,
  },
  {
    name: "Vercel",
    slug: "vercel",
    category: "Cloud",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vercel.svg",
    color: "#a1a1aa",
    proficiency: 85,
    isActive: true,
    featured: false,
    sortOrder: 23,
  },
  {
    name: "Render",
    slug: "render",
    category: "Cloud",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/render.svg",
    color: "#46e3b7",
    proficiency: 80,
    isActive: true,
    featured: false,
    sortOrder: 24,
  },
  {
    name: "Figma",
    slug: "figma",
    category: "Design",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg",
    color: "#f24e1e",
    proficiency: 89,
    isActive: true,
    featured: false,
    sortOrder: 25,
  },
  {
    name: "Postman",
    slug: "postman",
    category: "DevOps",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/postman.svg",
    color: "#ff6c37",
    proficiency: 87,
    isActive: true,
    featured: false,
    sortOrder: 26,
  },
];

interface MarqueeRowProps {
  items: Technology[];
  direction: "left" | "right";
  speed: number;
}

function TechLogo({ tech, className }: { tech: Technology; className?: string }) {
  const isUrl = /^(https?:)?\/\//i.test(tech.icon) || tech.icon.startsWith("/");
  if (isUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={tech.icon} alt={tech.name} draggable={false} className={`${className} object-contain`} />
    );
  }
  const initials = tech.name.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase() || "T";
  return <span className={`${className} font-display font-bold`}>{initials}</span>;
}

function TechCard({ tech }: { tech: Technology }) {
  const color = tech.color || "#6366f1";
  return (
    <article className="group/card relative shrink-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-lg transition-opacity duration-300 group-hover/card:opacity-70"
        style={{ background: `radial-gradient(60% 60% at 50% 50%, ${color}59, transparent 70%)` }}
      />
      <div className="glass-panel relative flex w-[140px] flex-col items-center gap-2 rounded-2xl px-4 py-4 transition-transform duration-[250ms] ease-out will-change-transform group-hover/card:scale-[1.06] sm:w-[170px] sm:py-5 md:w-[190px]">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl sm:h-14 sm:w-14"
          style={{
            background: `linear-gradient(135deg, ${color}2e, ${color}0d)`,
            border: `1px solid ${color}40`,
            color,
          }}
        >
          <TechLogo tech={tech} className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <span className="text-sm font-semibold text-slate-800 sm:text-[15px] dark:text-slate-100">{tech.name}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-[11px] dark:text-slate-400">
          {tech.category || "Tech"}
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl border-2 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ borderColor: `${color}66` }}
      />
    </article>
  );
}

function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [groupWidth, setGroupWidth] = useState(0);
  const x = useMotionValue(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartValue = useRef(0);

  // Measure the width of one complete group of items
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setGroupWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Continuous animation
  useAnimationFrame((_, delta) => {
    if (pausedRef.current || draggingRef.current || !groupWidth) return;
    const step = (speed * delta) / 1000 * (direction === "left" ? -1 : 1);
    let newX = x.get() + step;

    // Seamless wrap: keep x within one group width to avoid visible gaps
    if (direction === "left") {
      if (newX < -groupWidth) newX += groupWidth;
    } else {
      if (newX > groupWidth) newX -= groupWidth;
    }
    x.set(newX);
  });

  // Drag handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartX.current = e.clientX;
    dragStartValue.current = x.get();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStartX.current;
    let newX = dragStartValue.current + delta;

    // Apply same wrap logic during drag to keep it seamless
    if (direction === "left") {
      if (newX < -groupWidth) newX += groupWidth;
      else if (newX > 0) newX -= groupWidth; // keep in [-groupWidth, 0]
    } else {
      if (newX > groupWidth) newX -= groupWidth;
      else if (newX < 0) newX += groupWidth; // keep in [0, groupWidth]
    }
    x.set(newX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  // Build the duplicated groups
  const groups = Array.from({ length: COPIES }, (_, i) => (
    <div
      key={i}
      ref={i === 0 ? containerRef : undefined}
      className="flex shrink-0 items-center pr-4"
      style={{ gap: BASE_GAP }}
    >
      {items.map((tech) => (
        <TechCard key={tech._id} tech={tech} />
      ))}
    </div>
  ));

  return (
    <div
      className="mask-fade-x overflow-hidden"
      onPointerEnter={() => (pausedRef.current = true)}
      onPointerLeave={() => (pausedRef.current = false)}
    >
      <motion.div
        className="flex w-max items-center will-change-transform"
        style={{ x, touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {groups}
      </motion.div>
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

  return (
    <section className="relative overflow-hidden py-14">
      <Reveal className="mx-auto max-w-2xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Our Technology Stack
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Powering innovation with the latest tools
        </h2>
      </Reveal>
      <div className="relative mt-10 space-y-4">
        <MarqueeRow items={items} direction="right" speed={55} />
        <MarqueeRow items={items} direction="left" speed={45} />
      </div>
    </section>
  );
}