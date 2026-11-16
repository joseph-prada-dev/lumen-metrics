"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import { faq } from "@/lib/content";
import { cn } from "@/lib/cn";

export function FAQ() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  useReveal(root, { y: 24, stagger: 0.06 });

  return (
    <section ref={root} id={faq.id} aria-labelledby="faq-title" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p data-reveal className="text-[13px] font-medium tracking-wide text-cyan uppercase">
            FAQ
          </p>
          <h2
            id="faq-title"
            data-reveal
            className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] md:text-5xl"
          >
            {faq.title}
          </h2>
        </div>

        <ul className="border-t border-border">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal className="border-b border-border">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-medium tracking-[-0.01em] transition-colors hover:text-fg md:text-xl"
                  >
                    {item.q}
                    <Plus
                      aria-hidden="true"
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted transition-transform duration-300 ease-out",
                        isOpen && "rotate-45 text-fg",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={cn("accordion-panel", isOpen && "is-open")}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="accordion-content pr-10 pb-6 text-muted">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
