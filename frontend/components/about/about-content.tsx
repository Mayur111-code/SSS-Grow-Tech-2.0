"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Eye, HeartHandshake, Award, Users, Rocket, TrendingUp, Globe } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useCounter } from "@/hooks/use-animations";

const values = [
  {
    icon: HeartHandshake,
    title: "Client Partnership",
    description: "We treat your business like our own, always aligned with your long-term goals.",
  },
  {
    icon: Rocket,
    title: "Ship Fast, Iterate",
    description: "Agile delivery with working software every sprint and continuous improvement.",
  },
  {
    icon: Award,
    title: "Quality Obsession",
    description: "Code reviews, automated testing and design polish on every single deliverable.",
  },
  {
    icon: Users,
    title: "People First",
    description: "We invest in our team because great products come from happy, senior talent.",
  },
];

const milestones = [
  { value: 250, suffix: "+", label: "Projects delivered" },
  { value: 120, suffix: "+", label: "Clients worldwide" },
  { value: 10, suffix: "+", label: "Years in business" },
  { value: 40, suffix: "+", label: "Team members" },
];

function Milestone({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { value: count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-bold text-white sm:text-4xl">
        {count}
        <span className="text-brand-300">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-white/70">{label}</p>
    </div>
  );
}

export function AboutContent() {
  return (
    <>
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <div className="relative">
                <div className="overflow-hidden rounded-3xl">
                  <Image
                    src="/sssgrow.jpg"
                    alt="SSS Grow Tech Team"
                    width={640}
                    height={480}
                    className="h-full w-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="glass absolute -bottom-6 -right-6 hidden rounded-2xl p-5 shadow-card sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">98%</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Client satisfaction</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Who we are</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                  A team of builders, dreamers & problem solvers
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
                  Founded with a simple belief — that every business deserves world-class technology.
                  Today, SSS Grow Tech is a team of senior engineers, designers and strategists
                  helping companies across 20+ countries build products their customers love.
                </p>
                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  From startups to enterprises, we&apos;ve shipped e-commerce platforms, healthcare
                  systems, fintech apps, AI tools and everything in between. Our approach is
                  simple: listen first, design thoughtfully and build exceptionally.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Reveal delay={0.15}>
                  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]">
                    <Target className="h-6 w-6 shrink-0 text-brand-500" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Our Mission</h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        To empower businesses with technology that drives measurable growth.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]">
                    <Eye className="h-6 w-6 shrink-0 text-brand-500" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Our Vision</h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        To be the most trusted technology partner for growing businesses globally.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 py-16">
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {milestones.map((m) => (
              <Milestone key={m.label} {...m} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our values</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              What we stand for
            </h2>
          </Reveal>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="h-full rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-white">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">{value.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal className="mt-20">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-10 text-center sm:p-14 dark:border-slate-800 dark:bg-[#0f101a]">
              <div className="flex items-center gap-2 text-brand-500">
                <Globe className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Globally trusted</span>
              </div>
              <h3 className="max-w-2xl font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                Ready to build something exceptional together?
              </h3>
              <a
                href="/contact"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-8 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Let&apos;s talk <Globe className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
