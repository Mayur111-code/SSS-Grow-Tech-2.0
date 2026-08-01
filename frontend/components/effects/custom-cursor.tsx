"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const noTouch = !window.matchMedia("(pointer: coarse)").matches;
    if (!fine && !noTouch) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMove = (e: globalThis.MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, textarea, select, [data-cursor]");
      setHovering(!!interactive);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full bg-brand-500 mix-blend-difference md:block"
        style={{ boxShadow: "0 0 12px rgba(99,102,241,0.8)" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden rounded-full border md:block"
        style={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          borderColor: hovering ? "rgba(139,92,246,0.9)" : "rgba(99,102,241,0.5)",
          backgroundColor: hovering ? "rgba(139,92,246,0.12)" : "transparent",
          mixBlendMode: "difference",
          transform: pressed ? "scale(0.8)" : undefined,
          transition:
            "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, background-color 0.25s ease",
        }}
      />
    </>
  );
}
