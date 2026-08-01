"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTestimonialsPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { getInitials, resolveImageUrl } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialsGrid() {
  const { data, isLoading } = useTestimonialsPublic();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {(data?.items || []).map((testimonial: Testimonial) => (
              <StaggerItem key={testimonial._id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative h-full rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-[#0f101a]"
                >
                  <Quote className="absolute right-6 top-6 h-8 w-8 text-brand-500/15" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    {testimonial.avatar ? (
                      <Image
                        src={resolveImageUrl(testimonial.avatar)}
                        alt={testimonial.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-semibold text-white">
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
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
