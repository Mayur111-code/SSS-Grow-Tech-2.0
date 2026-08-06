"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingCTA } from "@/components/layout/floating-cta";
import { Particles } from "@/components/effects/particles";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { usePublicSettings } from "@/services/queries";

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  usePublicSettings();
  const pathname = usePathname();

  return (
    <>
      <ScrollToTop />
      <Particles />
      <SmoothScroll>
        <Navbar />
        <main className="relative min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <FloatingCTA />
      </SmoothScroll>
    </>
  );
}
