"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, MapPin, Clock } from "lucide-react";
import { useCareersPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { Badge } from "@/components/ui/badge";
import type { Career } from "@/types";

const typeVariant = (type: string) => {
  switch (type) {
    case "full-time":
      return "success";
    case "part-time":
      return "info";
    case "contract":
      return "warning";
    case "internship":
      return "purple";
    default:
      return "neutral";
  }
};

export function CareersList() {
  const { data, isLoading } = useCareersPublic();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <CardSkeleton count={4} />
        ) : (data?.items || []).length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4">No open positions right now. Check back soon!</p>
          </div>
        ) : (
          <StaggerContainer className="space-y-5" stagger={0.08}>
            {(data?.items || []).map((job: Career) => (
              <StaggerItem key={job._id}>
                <Link href={`/careers/${job.slug}`} className="group block">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-card sm:p-7 dark:border-slate-800 dark:bg-[#0f101a]"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={typeVariant(job.type)}>{job.type}</Badge>
                          <Badge variant="neutral">{job.department}</Badge>
                          {job.featured && <Badge variant="brand">Featured</Badge>}
                        </div>
                        <h2 className="mt-3 font-display text-xl font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                          {job.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" /> {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" /> {job.experience || "Any experience"}
                          </span>
                          {job.salary && <span className="text-emerald-600 dark:text-emerald-400">{job.salary}</span>}
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition group-hover:border-brand-500 group-hover:text-brand-600 dark:border-slate-700 dark:text-slate-200">
                        Apply now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
