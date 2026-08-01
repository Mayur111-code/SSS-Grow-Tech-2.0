"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090f] px-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Logo size="lg" glow />
        </motion.div>
        <motion.p
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="font-display text-8xl font-bold text-gradient sm:text-9xl"
        >
          404
        </motion.p>
        <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Page not found</h1>
        <p className="mt-3 max-w-md text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Magnetic>
            <Link href="/">
              <Button size="lg" variant="gradient" magnetic>
                <Home className="h-4 w-4" /> Back to home
              </Button>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:border-white/40" magnetic>
                <ArrowLeft className="h-4 w-4" /> Contact us
              </Button>
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </div>
  );
}
