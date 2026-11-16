"use client";

import { useRef } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { stats } from "@/lib/content";

export function Stats() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      gsap.utils.toArray<HTMLElement>("[data-count]", root.current).forEach((el) => {
        const target = Number(el.dataset.count);
        const state = { v: 0 };
        el.textContent = "0";
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(state.v));
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="stats-title" className="px-4 sm:px-6">
      <h2 id="stats-title" className="sr-only">
        Lumen by the numbers
      </h2>
      <div className="mx-auto max-w-6xl border-y border-border py-16 md:py-20">
        <dl className="grid gap-12 text-center md:grid-cols-3 md:gap-6">
          {stats.items.map((s) => (
            <div key={s.label} data-reveal className="flex flex-col-reverse items-center justify-end">
              <dt className="mt-2 max-w-[16rem] text-[15px] text-muted">{s.label}</dt>
              <dd className="font-display text-6xl font-semibold tracking-[-0.04em] md:text-7xl">
                {/* Ghost value reserves width so counting never shifts layout. */}
                <span className="inline-grid">
                  <span className="invisible [grid-area:1/1]" aria-hidden="true">
                    {s.value}
                  </span>
                  <span data-count={s.value} className="text-right [grid-area:1/1]">
                    {s.value}
                  </span>
                </span>
                <span className="text-gradient">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 text-center text-[12px] text-muted">{stats.footnote}</p>
      </div>
    </section>
  );
}
