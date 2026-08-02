"use client";

import { motion } from "framer-motion";
import { Check, Rocket } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$2,500",
    period: "project",
    description: "Perfect for small businesses and landing pages.",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Basic SEO setup",
      "Contact form",
      "2 revision rounds",
      "2 weeks delivery",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$8,000",
    period: "project",
    description: "For growing businesses that need a full web presence.",
    features: [
      "Up to 15 pages",
      "Custom design system",
      "CMS integration",
      "Advanced SEO",
      "Analytics & tracking",
      "5 revision rounds",
      "6 weeks delivery",
      "30 days support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "engagement",
    description: "For complex platforms, mobile apps and AI solutions.",
    features: [
      "Unlimited pages/features",
      "Dedicated team",
      "Mobile & web apps",
      "AI & integrations",
      "Cloud infrastructure",
      "Security audit",
      "Priority support",
      "SLA & maintenance",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-3" stagger={0.12}>
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <motion.div
                whileHover={{ y: -8 }}
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-8 transition-shadow",
                  plan.popular
                    ? "border-brand-500/60 bg-gradient-to-b from-brand-600/10 to-transparent shadow-[0_20px_60px_-20px_rgba(99,102,241,0.5)] dark:border-brand-500/40"
                    : "border-slate-200 bg-white hover:shadow-card dark:border-slate-800 dark:bg-[#0f101a]"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-sm text-slate-400">/ {plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/contact?type=${plan.name.toLowerCase()}`} className="mt-8 block">
                  <Magnetic>
                    <Button
                      variant={plan.popular ? "gradient" : "outline"}
                      className="w-full"
                      size="lg"
                      magnetic
                    >
                      <Rocket className="h-4 w-4" /> Get started
                    </Button>
                  </Magnetic>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal className="mt-16">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0f101a]">
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Need something custom?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Every business is different. Contact us for a personalized proposal based on your exact
              requirements, timeline and budget.
            </p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button size="lg" variant="gradient" magnetic>
                Get a custom quote
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
