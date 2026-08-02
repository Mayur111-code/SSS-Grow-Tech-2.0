"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useFaqsPublic } from "@/services/queries";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

function FaqItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-soft dark:border-slate-800 dark:bg-[#0f101a]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-display text-base font-semibold text-slate-900 dark:text-white">{faq.question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
            open ? "bg-brand-600 text-white" : "bg-brand-500/10 text-brand-500"
          )}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="break-words border-t border-slate-100 p-5 leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqList() {
  const { data, isLoading } = useFaqsPublic();
  const faqs = data?.items || [];
  const groups = faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <CardSkeleton count={5} />
        ) : Object.keys(groups).length === 0 ? (
          <div className="py-20 text-center text-slate-500">No FAQs yet.</div>
        ) : (
          Object.entries(groups).map(([category, items]) => (
            <div key={category} className="mb-12">
              <Reveal>
                <h2 className="mb-5 font-display text-xl font-bold text-slate-900 dark:text-white">{category}</h2>
              </Reveal>
              <StaggerContainer className="space-y-4" stagger={0.06}>
                {items.map((faq) => (
                  <StaggerItem key={faq._id}>
                    <FaqItem faq={faq} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))
        )}

        <Reveal className="mt-8">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <MessageCircle className="h-8 w-8 text-brand-500" />
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Still have questions?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Our team is happy to help. Reach out anytime.
            </p>
            <Link
              href="/contact"
              className="mt-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Contact us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
