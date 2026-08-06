"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react";
import { Reveal } from "@/hooks/use-animations";
import { Magnetic } from "@/components/effects/magnetic";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-16 text-center shadow-[0_40px_100px_-30px_rgba(99,102,241,0.6)] sm:px-16 sm:py-20">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-glow" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl animate-pulse-glow" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent-400/20 blur-3xl animate-aurora" />

            <div className="relative">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur"
              >
                <Sparkles className="h-3.5 w-3.5" /> Free Consultation
              </motion.span>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to grow your business with technology?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                Book a free consultation and let our experts help you build the right solution for
                your business goals.
              </p>
              <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <Magnetic>
                  <Link href="/contact" className="block w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full btn-shine bg-white text-brand-700 shadow-xl hover:bg-slate-100 sm:w-auto"
                      magnetic
                    >
                      Get a Free Quote <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/pricing" className="block w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white/40 text-white hover:border-white hover:bg-white/10 sm:w-auto"
                      magnetic
                    >
                      <MessageSquareText className="h-5 w-5" /> View Pricing
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
