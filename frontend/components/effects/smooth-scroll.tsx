"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const gsapContext = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap]").forEach((el) => {
        const type = el.dataset.gsap;
        if (type === "parallax") {
          gsap.fromTo(
            el,
            { y: 80 },
            {
              y: -80,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
        if (type === "fade") {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            }
          );
        }
        if (type === "scale") {
          gsap.fromTo(
            el,
            { scale: 0.9 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, wrapper);

    return () => gsapContext.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {children}
    </div>
  );
}
