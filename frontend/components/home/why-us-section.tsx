"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Users, Globe } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { Magnetic } from "@/components/effects/magnetic";
import { TiltCard } from "@/components/effects/tilt-card";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Zap,
    title: "Speed & Performance",
    description: "Blazing-fast products built with modern frameworks and best practices.",
  },
  {
    icon: ShieldCheck,
    title: "Security First",
    description: "Enterprise-grade security embedded in everything we build.",
  },
  {
    icon: Users,
    title: "Senior Talent",
    description: "Work directly with senior engineers and designers, no juniors.",
  },
  {
    icon: Globe,
    title: "Global Delivery",
    description: "Distributed team delivering across time zones, 24/7.",
  },
];

export function WhyUsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Why SSS Grow Tech</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              A partner obsessed with <span className="text-gradient">your success</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              We&apos;re not just a vendor. We&apos;re your technology partner — invested in your
              growth, aligned with your goals and accountable for results. Over a decade of
              experience shipping products that businesses rely on every day.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link href="/about">
                  <Button size="lg" variant="gradient" magnetic className="btn-shine">
                    More about us <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.1}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <TiltCard className="h-full" intensity={8}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="gradient-border h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-card dark:border-slate-800 dark:bg-[#0f101a]"
                  >
                    <div className="tilt-inner">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-600/15 text-brand-500">
                        <value.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">{value.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{value.description}</p>
                    </div>
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
