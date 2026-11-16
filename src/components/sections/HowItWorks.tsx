"use client";

import { useRef } from "react";
import { Activity, CreditCard, GitCommitHorizontal } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { howItWorks } from "@/lib/content";
import { Sparkline, makeSeries } from "@/components/ui/Sparkline";
import { SlackCard } from "@/components/ui/SlackCard";

/* Pinned version only runs on desktop with motion allowed. The same media query
   drives the CSS swap in globals.css (.hiw-pinned / .hiw-stacked). */
const PINNED_MQ = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/* ------------------------------------------------------------------ Visual
   Everything is positioned in a 100 × 80 coordinate space (aspect 5:4) so the
   SVG connector lines line up exactly with the HTML cards and nodes. */

const COLS = [0, 20, 40];
const ROWS = [0, 27.6, 55.2];
const CARD_W = 18;
const CARD_H = 24.8;
const NODE_X = 76;
const NODE_W = 24;
const NODE_H = 17;
const NODE_YS = [12, 40, 68];
const LINK_FROM = { x: 58, y: 40 };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const linkPath = (y: number) => `M${LINK_FROM.x},${LINK_FROM.y} C${LINK_FROM.x + 9},${LINK_FROM.y} ${NODE_X - 9},${y} ${NODE_X},${y}`;

const sourceIcons = [GitCommitHorizontal, Activity, CreditCard];
const series = howItWorks.metrics.map((_, i) => makeSeries(i + 1));
const hotSeries = makeSeries(6, 16, "drop");

/** stage: 0 = untouched (pinned initial), 1 = detect, 2 = explain, 3 = act */
function Visual({ stage }: { stage: 0 | 1 | 2 | 3 }) {
  const dim = stage >= 2 ? 0.3 : 1;
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]" aria-hidden="true">
      {/* Metric grid */}
      <div data-v="grid">
        {howItWorks.metrics.map((m, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <div
              key={m.label}
              data-v={m.hot ? "hot-card" : "card"}
              className="absolute flex flex-col justify-between overflow-hidden rounded-[10px] border border-border bg-surface p-2 sm:p-2.5"
              style={{
                left: pct(COLS[col], 100),
                top: pct(ROWS[row], 80),
                width: pct(CARD_W, 100),
                height: pct(CARD_H, 80),
                opacity: m.hot ? 1 : dim,
              }}
            >
              <div>
                <p className="truncate text-[9px] text-muted sm:text-[10px]">{m.label}</p>
                <p className="font-display text-[12px] font-semibold sm:text-[14px]">{m.value}</p>
              </div>
              <Sparkline values={series[i]} stroke="rgba(138,143,152,0.7)" className="h-[30%] w-full" />

              {m.hot && (
                <div
                  data-v="amber"
                  className="absolute inset-0 flex flex-col justify-between rounded-[10px] border border-alert/70 bg-[#1A1610] p-2 sm:p-2.5"
                  style={{ opacity: stage >= 1 ? 1 : 0 }}
                >
                  <div>
                    <p className="truncate text-[9px] text-alert sm:text-[10px]">{m.label}</p>
                    <p className="flex items-baseline gap-1 font-display text-[12px] font-semibold sm:text-[14px]">
                      {m.value}
                      <span className="text-[9px] font-medium text-alert sm:text-[10px]">{howItWorks.hotDelta}</span>
                    </p>
                  </div>
                  <Sparkline values={hotSeries} stroke="#F59E0B" strokeWidth={1.75} className="h-[30%] w-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Connector lines */}
      <svg
        data-v="links"
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        style={{ opacity: stage === 3 ? 0.35 : 1 }}
      >
        {NODE_YS.map((y, i) => (
          <path
            key={y}
            data-v="link"
            d={linkPath(y)}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.35"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={stage >= 2 ? 0 : 1}
            style={{ opacity: stage >= 2 ? 1 : 0 }}
            data-index={i}
          />
        ))}
        <path
          data-v="hot-link"
          d={linkPath(NODE_YS[0])}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="0.45"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={stage >= 2 ? 0 : 1}
          style={{ opacity: stage >= 2 ? 1 : 0 }}
        />
        <circle cx={LINK_FROM.x} cy={LINK_FROM.y} r="0.9" fill="#F59E0B" data-v="link-dot" style={{ opacity: stage >= 2 ? 1 : 0 }} />
      </svg>

      {/* Source nodes */}
      <div data-v="nodes" style={{ opacity: stage === 3 ? 0.35 : 1 }}>
        {howItWorks.sources.map((s, i) => {
          const Icon = sourceIcons[i];
          return (
            <div
              key={s.label}
              data-v="node"
              className="absolute flex items-center gap-2 rounded-[10px] border border-border bg-surface px-2 sm:px-3"
              style={{
                left: pct(NODE_X, 100),
                top: pct(NODE_YS[i] - NODE_H / 2, 80),
                width: pct(NODE_W, 100),
                height: pct(NODE_H, 80),
                opacity: stage >= 2 ? 1 : 0,
              }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-muted sm:h-4 sm:w-4" />
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium sm:text-[12px]">{s.label}</p>
                <p className="truncate text-[8px] text-muted sm:text-[10px]">{s.detail}</p>
              </div>
              {s.hot && (
                <div
                  data-v="node-glow"
                  className="absolute inset-0 flex items-center gap-2 rounded-[10px] border border-alert/80 bg-[#1A1610] px-2 shadow-[0_0_24px_-4px_rgba(245,158,11,0.55)] sm:px-3"
                  style={{ opacity: stage >= 2 ? 1 : 0 }}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-alert sm:h-4 sm:w-4" />
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-medium sm:text-[12px]">{s.label}</p>
                    <p className="truncate text-[8px] text-alert sm:text-[10px]">{s.detail}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slack message */}
      <div data-v="slack" className="absolute right-[3%] bottom-[3%] left-[3%]" style={{ opacity: stage === 3 ? 1 : 0 }}>
        <SlackCard />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Section */

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const stacked = useRef<HTMLDivElement>(null);
  useReveal(stacked);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PINNED_MQ, () => {
        const q = gsap.utils.selector(root.current!.querySelector(".hiw-pinned"));
        const steps = q("[data-step]");
        const dots = q("[data-dot]");
        const nodes = q("[data-v=node]");

        // Initial states (stage 0)
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 28 });
        gsap.set(dots.slice(1), { opacity: 0.35 });
        gsap.set(q("[data-v=amber]"), { opacity: 0 });
        gsap.set(nodes, { opacity: 0, x: 16 });
        gsap.set(q("[data-v=node-glow], [data-v=link-dot]"), { opacity: 0 });
        gsap.set(q("[data-v=link], [data-v=hot-link]"), { strokeDashoffset: 1, opacity: 0 });
        gsap.set(q("[data-v=slack]"), { opacity: 0, y: 48 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 3 }, 0)
          // 1 · Detect: one sparkline turns amber
          .to(q("[data-v=amber]"), { opacity: 1, duration: 0.35 }, 0.35)
          .fromTo(q("[data-v=hot-card]"), { scale: 1 }, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1 }, 0.35)
          // 2 · Explain: grid dims, lines trace to sources, Deploys lights up
          .to(steps[0], { autoAlpha: 0, y: -28, duration: 0.3 }, 1)
          .to(steps[1], { autoAlpha: 1, y: 0, duration: 0.3 }, 1.1)
          .to(dots[1], { opacity: 1, duration: 0.2 }, 1)
          .to(q("[data-v=card]"), { opacity: 0.3, duration: 0.3 }, 1.05)
          .to(q("[data-v=link-dot]"), { opacity: 1, duration: 0.1 }, 1.15)
          .to(nodes, { opacity: 1, x: 0, stagger: 0.08, duration: 0.3 }, 1.15)
          .to(q("[data-v=link]"), { strokeDashoffset: 0, opacity: 1, stagger: 0.08, duration: 0.35 }, 1.2)
          .to(q("[data-v=hot-link]"), { strokeDashoffset: 0, opacity: 1, duration: 0.3 }, 1.6)
          .to(q("[data-v=node-glow]"), { opacity: 1, duration: 0.25 }, 1.75)
          // 3 · Act: answer lands in Slack
          .to(steps[1], { autoAlpha: 0, y: -28, duration: 0.3 }, 2)
          .to(steps[2], { autoAlpha: 1, y: 0, duration: 0.3 }, 2.1)
          .to(dots[2], { opacity: 1, duration: 0.2 }, 2)
          .to(q("[data-v=links], [data-v=nodes]"), { opacity: 0.35, duration: 0.3 }, 2.05)
          .to(q("[data-v=hot-card]"), { opacity: 0.4, duration: 0.3 }, 2.05)
          .to(q("[data-v=slack]"), { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2.15)
          .set({}, {}, 3); // hold the final state before unpinning
      });
    },
    { scope: root },
  );

  const steps = howItWorks.steps;

  return (
    <section ref={root} id={howItWorks.id} aria-labelledby="hiw-title" className="relative">
      <h2 id="hiw-title" className="sr-only">
        {howItWorks.eyebrow}
      </h2>

      {/* Desktop: pinned, scroll-driven story */}
      <div className="hiw-pinned">
        <div data-pin className="flex h-screen items-center px-6">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_1.15fr] items-center gap-10 lg:gap-16">
            <div>
              <p className="text-[13px] font-medium tracking-wide text-cyan uppercase">{howItWorks.eyebrow}</p>

              {/* Progress 01–02–03 */}
              <div className="mt-6 max-w-sm">
                <ol className="flex justify-between text-[13px]">
                  {steps.map((s, i) => (
                    <li key={s.key} data-dot className="flex items-center gap-2">
                      <span className="font-display font-semibold text-fg">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-muted">{s.label}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 h-px w-full bg-border">
                  <div data-progress className="h-px w-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
                </div>
              </div>

              <div className="mt-10 grid">
                {steps.map((s, i) => (
                  <div key={s.key} data-step className="[grid-area:1/1]">
                    <p className="text-[14px] font-medium text-muted">
                      {String(i + 1).padStart(2, "0")} · {s.label}
                    </p>
                    <h3 className="mt-3 font-display text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance lg:text-5xl">
                      {s.text}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            <Visual stage={0} />
          </div>
        </div>
      </div>

      {/* Mobile + reduced motion: three stacked steps with simple reveals */}
      <div ref={stacked} className="hiw-stacked mx-auto max-w-xl px-4 py-20 sm:px-6">
        <p className="text-[13px] font-medium tracking-wide text-cyan uppercase">{howItWorks.eyebrow}</p>
        <ol className="mt-8 space-y-16">
          {steps.map((s, i) => (
            <li key={s.key} data-reveal>
              <p className="text-[14px] font-medium text-muted">
                {String(i + 1).padStart(2, "0")} · {s.label}
              </p>
              <h3 className="mt-2 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] text-balance">
                {s.text}
              </h3>
              <div className="mt-6">
                <Visual stage={(i + 1) as 1 | 2 | 3} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
