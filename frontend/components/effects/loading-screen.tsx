"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
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
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-[rgb(var(--bg))]"
        >
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[80px]" />

          {/* Circular loader */}
          <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-xl" />

            {/* SVG rotating ring */}
            <svg
              className="absolute inset-0"
              viewBox="0 0 110 110"
              fill="none"
              style={{ animation: "loaderSpin 1.8s linear infinite" }}
            >
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle
                cx="55"
                cy="55"
                r="50"
                stroke="url(#ringGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="220 314"
              />
            </svg>

            {/* Inner circle background */}
            <div className="relative flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200/60 dark:bg-[#0f101a] dark:ring-white/10">
              <Image
                src="/sssgrow.jpg"
                alt="SSS Grow Tech"
                width={52}
                height={52}
                className="rounded-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Brand text below */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-[calc(50%-80px)] text-xs font-medium tracking-widest text-slate-400 dark:text-white/40"
          >
            SSS GROW TECH
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
