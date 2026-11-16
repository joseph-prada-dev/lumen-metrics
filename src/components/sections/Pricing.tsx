"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { pricing, type Plan } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

/** Yearly = 2 months free → 10 months billed over 12. */
const perMonth = (monthly: number, yearly: boolean) => (yearly ? Math.round((monthly * 10) / 12) : monthly);

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const body = (
    <div className={cn("flex h-full flex-col rounded-card p-6 sm:p-7", plan.highlighted ? "bg-surface" : "border border-border bg-surface")}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
        {plan.badge && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-bg">{plan.badge}</span>
        )}
      </div>

      <div className="mt-5 flex h-14 items-end gap-1">
        {plan.monthly === null ? (
          <span className="font-display text-5xl font-semibold tracking-[-0.03em]">Custom</span>
        ) : (
          <>
            <span className="overflow-hidden font-display text-5xl font-semibold tracking-[-0.03em]">
              <span data-price className="inline-block tabular-nums">
                ${perMonth(plan.monthly, yearly)}
              </span>
            </span>
            <span className="mb-1.5 text-muted">/mo</span>
          </>
        )}
      </div>
      <p className="mt-1 h-5 text-[13px] text-muted">
        {plan.monthly === null ? "Tailored to your data volume" : yearly ? `Billed $${plan.monthly * 10} yearly` : "Billed monthly"}
      </p>

      <ul className="mt-6 space-y-3 text-[15px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className={cn("mt-1 h-4 w-4 shrink-0", plan.highlighted ? "text-cyan" : "text-muted")} aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <Button href={plan.cta.href} variant={plan.highlighted ? "primary" : "secondary"} className="mt-8 w-full sm:mt-auto">
        {plan.cta.label}
      </Button>
    </div>
  );

  if (!plan.highlighted) return body;

  // Highlighted plan: a slowly rotating conic gradient shows through a 1px gap.
  return (
    <div className="relative isolate h-full overflow-hidden rounded-card p-px">
      <div aria-hidden="true" className="gradient-border-spin absolute top-1/2 left-1/2 -z-10 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2" />
      <div className="h-full shadow-[0_0_80px_-30px_rgba(124,92,255,0.7)]">{body}</div>
    </div>
  );
}

export function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [yearly, setYearly] = useState(false);
  const mounted = useRef(false);
  useReveal(root, { stagger: 0.12 });

  // Prices roll when the billing period changes.
  useGSAP(
    () => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      gsap.fromTo(
        "[data-price]",
        { yPercent: yearly ? 60 : -60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" },
      );
    },
    { scope: root, dependencies: [yearly] },
  );

  return (
    <section ref={root} id={pricing.id} aria-labelledby="pricing-title" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-[13px] font-medium tracking-wide text-cyan uppercase">
            Pricing
          </p>
          <h2
            id="pricing-title"
            data-reveal
            className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-6xl"
          >
            {pricing.title}
          </h2>

          <div data-reveal className="mt-8 inline-flex items-center gap-3">
            <span className={cn("text-[14px] transition-colors", !yearly ? "text-fg" : "text-muted")}>Monthly</span>
            <button
              type="button"
              role="switch"
              aria-checked={yearly}
              aria-label="Bill yearly"
              onClick={() => setYearly((y) => !y)}
              className="relative h-7 w-12 rounded-full border border-border-strong bg-white/[0.06] transition-colors aria-checked:bg-violet/40"
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-[22px] w-[22px] rounded-full bg-fg transition-transform duration-300 ease-out",
                  yearly && "translate-x-5",
                )}
              />
            </button>
            <span className={cn("text-[14px] transition-colors", yearly ? "text-fg" : "text-muted")}>Yearly</span>
            <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[12px] font-medium text-success">
              {pricing.yearlyNote}
            </span>
          </div>
        </div>

        <div className="mt-14 grid items-stretch gap-4 md:grid-cols-3">
          {pricing.plans.map((plan) => (
            <div key={plan.name} data-reveal>
              <PlanCard plan={plan} yearly={yearly} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
