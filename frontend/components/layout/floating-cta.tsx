"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText, X, Mail, Phone } from "lucide-react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="gradient-border w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0f101a]"
          >
            <div className="bg-gradient-to-r from-brand-600 to-accent-600 p-4 text-white">
              <h4 className="font-display font-semibold">Need help with a project?</h4>
              <p className="mt-0.5 text-xs text-white/80">Our team typically replies within 24 hours.</p>
            </div>
            <div className="space-y-3 p-4">
              <a
                href="mailto:sssgrowtech@gmail.com"
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-500" />
                <span className="truncate">sssgrowtech@gmail.com</span>
              </a>
              <a
                href="tel:+917028507985"
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
              >
                <Phone className="h-4 w-4 shrink-0 text-brand-500" />
                +91 70285 07985
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                Request a quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(!open)}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-[0_10px_40px_-8px_rgba(99,102,241,0.7)]"
            aria-label="Contact us"
          >
            {open ? <X className="h-6 w-6" /> : <MessageSquareText className="h-6 w-6" />}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
