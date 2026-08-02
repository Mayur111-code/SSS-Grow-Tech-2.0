"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Code2, Rocket, LineChart } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { TiltCard } from "@/components/effects/tilt-card";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Discovery",
    description: "We dive deep into your goals, users and market to define the perfect solution.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    description: "Wireframes, prototypes and pixel-perfect interfaces designed for conversion.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Development",
    description: "Agile sprints, clean code, regular demos and complete transparency.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Launch",
    description: "Zero-downtime deployment, rigorous QA and performance optimization.",
  },
  {
    icon: LineChart,
    step: "05",
    title: "Grow",
    description: "Continuous improvement, analytics and scaling support post-launch.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Process</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            From idea to launch in <span className="text-gradient">5 steps</span>
          </h2>
        </Reveal>

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5" stagger={0.12}>
          {steps.map((step) => (
            <StaggerItem key={step.step}>
              <TiltCard className="h-full" intensity={10}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="gradient-border relative h-full rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]"
                >
                  <span className="font-display text-4xl font-bold text-brand-500/15">{step.step}</span>
                  <div className="tilt-inner">
                    <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)]">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{step.description}</p>
                  </div>
                </motion.div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
