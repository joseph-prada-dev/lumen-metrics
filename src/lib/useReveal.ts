"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, REDUCED_MOTION } from "@/lib/gsap";

type Options = { y?: number; stagger?: number; start?: string };

/**
 * Staggered "rise in" for every `[data-reveal]` element inside `scope`, once.
 * Reduced motion: plain opacity fade, no movement.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, { y = 32, stagger = 0.08, start = "top 88%" }: Options = {}) {
  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
      if (!els.length) return;
      const reduce = window.matchMedia(REDUCED_MOTION).matches;

      gsap.set(els, { opacity: 0, y: reduce ? 0 : y });
      ScrollTrigger.batch(els, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: reduce ? 0.5 : 0.8,
            ease: reduce ? "none" : "power3.out",
            stagger: reduce ? 0 : stagger,
            overwrite: true,
          }),
      });
    },
    { scope },
  );
}
