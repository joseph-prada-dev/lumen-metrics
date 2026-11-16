"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { finalCta } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      const q = gsap.utils.selector(root);
      const split = SplitText.create(q("h2")[0], { type: "words", wordsClass: "inline-block" });

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
        .fromTo(q("[data-glow]"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, 0)
        .from(split.words, { yPercent: 70, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.1)
        .from(q("[data-cta]"), { y: 16, opacity: 0, duration: 0.6 }, 0.5);

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="cta-title" className="relative isolate overflow-hidden px-4 py-32 sm:px-6 md:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div
          data-glow
          className="h-[520px] w-[900px] max-w-[160vw] rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.45),rgba(34,211,238,0.18)_55%,transparent)]"
        />
      </div>
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto max-w-4xl text-center">
        <h2 id="cta-title" className="h1-display text-balance">
          {finalCta.title}
        </h2>
        <div data-cta className="mt-10 flex justify-center">
          <Button href={finalCta.cta.href}>
            {finalCta.cta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
