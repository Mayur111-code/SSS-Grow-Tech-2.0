"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Smartphone, BrainCircuit, Palette, Cloud, Megaphone, MonitorSmartphone, Sparkles } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useServicesPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { TiltCard } from "@/components/effects/tilt-card";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Code2> = {
  Code2,
  Smartphone,
  BrainCircuit,
  Palette,
  Cloud,
  Megaphone,
  MonitorSmartphone,
  Sparkles,
};

function iconFor(index: number) {
  const icons = [Code2, Smartphone, BrainCircuit, Palette, Cloud, Megaphone, MonitorSmartphone];
  return icons[index % icons.length];
}

export function ServicesSection() {
  const { data, isLoading } = useServicesPublic();

  return (
    <section className="relative py-20 sm:py-28" id="services">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Services</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Everything you need to <span className="text-gradient">grow digitally</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            From strategy to launch, we offer end-to-end technology services that turn ideas into
            scalable, beautiful, high-performing products.
          </p>
        </Reveal>

        {isLoading ? (
          <CardSkeleton className="mt-14" />
        ) : (
          <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {(data?.items || []).map((service: Service, index: number) => {
              const Icon = iconFor(index);
              return (
                <StaggerItem key={service._id}>
                  <Link href={`/services/${service.slug}`} className="group block h-full">
                    <TiltCard className="h-full">
                      <div className="gradient-border relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="tilt-inner">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-[0_8px_24px_-6px_rgba(99,102,241,0.5)]">
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="mt-5 font-display text-lg font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                            {service.title}
                          </h3>
                          <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {service.shortDescription}
                          </p>
                          <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-brand-400">
                            Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
