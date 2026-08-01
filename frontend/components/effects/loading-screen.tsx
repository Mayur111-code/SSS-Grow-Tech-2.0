"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export function LoadingScreen({ minimal = false }: { minimal?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 18;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 350);
      }
      setProgress(Math.floor(current));
    }, 160);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-mesh dark:bg-[#09090f]"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[100px] animate-pulse-glow" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-7"
          >
            {minimal ? (
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="font-display text-2xl font-bold"
              >
                SSS <span className="text-gradient">Grow Tech</span>
              </motion.span>
            ) : (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <Logo size="lg" glow />
              </motion.div>
            )}
            <div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/10 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="text-xs tracking-widest text-slate-500 dark:text-white/50">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
