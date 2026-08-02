"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { useTestimonialsPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { TiltCard } from "@/components/effects/tilt-card";
import { getInitials, resolveImageUrl } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialsSection() {
  const { data, isLoading } = useTestimonialsPublic();

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Testimonials</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Trusted by <span className="text-gradient">amazing teams</span>
          </h2>
        </Reveal>

        {isLoading ? (
          <CardSkeleton className="mt-12" count={3} />
        ) : (
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.1}>
            {(data?.items || []).slice(0, 3).map((testimonial: Testimonial) => (
              <StaggerItem key={testimonial._id}>
                <TiltCard className="h-full" intensity={8}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="gradient-border relative h-full rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-[#0f101a]"
                  >
                    <Quote className="absolute right-6 top-6 h-8 w-8 text-brand-500/15" />
                    <div className="tilt-inner">
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-4 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                        {testimonial.avatar?.url ? (
                          <Image
                            src={resolveImageUrl(testimonial.avatar)}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-semibold text-white">
                            {getInitials(testimonial.name)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {testimonial.role} {testimonial.company && `· ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
