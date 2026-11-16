"use client";

import { useRef } from "react";
import { BellRing, Mail, MessageSquareText, Sparkles } from "lucide-react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import { features } from "@/lib/content";
import { Card } from "@/components/ui/Card";
import { Sparkline, makeSeries } from "@/components/ui/Sparkline";

const [anomaly, insights, alerts] = features.items;
const spikeSeries = makeSeries(4, 22, "spike");

function TypedInsight() {
  const root = useRef<HTMLDivElement>(null);
  const text = insights.typed ?? "";

  useGSAP(
    () => {
      const out = root.current!.querySelector<HTMLElement>("[data-typed]")!;
      if (window.matchMedia(REDUCED_MOTION).matches) return;

      out.textContent = "";
      const state = { n: 0 };
      gsap.to(state, {
        n: text.length,
        duration: text.length * 0.022,
        ease: "none",
        delay: 0.4,
        onUpdate: () => {
          out.textContent = text.slice(0, Math.round(state.n));
        },
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      gsap.from(root.current!.querySelectorAll("[data-chip]"), {
        opacity: 0,
        y: 8,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.4 + text.length * 0.022,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="rounded-xl border border-border bg-bg/60 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[12px] font-medium text-cyan">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Lumen insight
      </div>
      {/* Ghost copy reserves the final height so typing never shifts layout. */}
      <div className="relative mt-3 text-[15px] leading-relaxed sm:text-base">
        <p className="invisible" aria-hidden="true">
          {text}
        </p>
        <p className="absolute inset-0 text-fg/90">
          <span data-typed>{text}</span>
          <span className="type-caret" aria-hidden="true" />
        </p>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {insights.chips?.map((c) => (
          <li key={c} data-chip className="rounded-full border border-border bg-white/[0.03] px-2.5 py-1 text-[12px] text-muted">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

const signupBars = [
  { d: "Mon", v: 72 },
  { d: "Tue", v: 78 },
  { d: "Wed", v: 81 },
  { d: "Thu", v: 64, hot: true },
  { d: "Fri", v: 80 },
  { d: "Sat", v: 58 },
  { d: "Sun", v: 55 },
];

/** Signups by day; Thursday's drop is the one the typed insight explains. */
function SignupBars() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      gsap.from(root.current!.querySelectorAll("[data-bar]"), {
        scaleY: 0,
        transformOrigin: "50% 100%",
        duration: 0.7,
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="rounded-xl border border-border bg-bg/60 p-4 sm:p-5" aria-hidden="true">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-muted">Signups · this week</span>
        <span className="rounded-full bg-alert/10 px-2 py-0.5 font-medium text-alert">Thu −18%</span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-2 sm:h-36 sm:gap-3">
        {signupBars.map((b) => (
          <div key={b.d} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              data-bar
              className={b.hot ? "w-full rounded-md bg-alert/80" : "w-full rounded-md bg-gradient-to-t from-violet/50 to-cyan/60"}
              style={{ height: `${b.v}%` }}
            />
            <span className={b.hot ? "text-[10px] font-medium text-alert" : "text-[10px] text-muted"}>{b.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnomalyVisual() {
  return (
    <div className="relative rounded-xl border border-border bg-bg/60 p-4" aria-hidden="true">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted">Sessions · live</span>
        <span className="rounded-full bg-alert/10 px-2 py-0.5 font-medium text-alert">+214% · 14:02</span>
      </div>
      <div className="relative mt-3">
        <Sparkline values={spikeSeries} stroke="url(#spark-grad)" strokeWidth={2} className="h-20 w-full" />
        <svg className="absolute h-0 w-0">
          <defs>
            <linearGradient id="spark-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#7C5CFF" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
        <span
          className="absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-surface bg-alert shadow-[0_0_0_4px_rgba(245,158,11,0.2)]"
          style={{ left: `${(14 / 21) * 100}%`, top: "3px" }}
        />
      </div>
    </div>
  );
}

function AlertsVisual() {
  const rows = [
    { Icon: MessageSquareText, where: "#revenue-alerts", what: "Revenue −12% on Tue · cause found" },
    { Icon: Mail, where: "Email digest", what: "3 anomalies explained this week" },
    { Icon: BellRing, where: "#growth", what: "Signups +9% · campaign “Spring-EU”" },
  ];
  return (
    <ul className="space-y-2" aria-hidden="true">
      {rows.map(({ Icon, where, what }) => (
        <li key={where} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 px-3 py-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <Icon className="h-3.5 w-3.5 text-cyan" />
          </span>
          <span className="min-w-0 text-[12px] leading-tight">
            <span className="block text-muted">{where}</span>
            <span className="block truncate text-fg/90">{what}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Features() {
  const root = useRef<HTMLElement>(null);
  useReveal(root, { y: 40, stagger: 0.1 });

  return (
    <section ref={root} id={features.id} aria-labelledby="features-title" className="px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p data-reveal className="text-[13px] font-medium tracking-wide text-cyan uppercase">
            Product
          </p>
          <h2
            id="features-title"
            data-reveal
            className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-6xl"
          >
            {features.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <div data-reveal className="md:col-span-2 md:row-span-2">
            <Card spotlight className="flex h-full flex-col p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{insights.title}</h3>
              <p className="mt-2 max-w-md text-muted">{insights.text}</p>
              <div className="mt-8 grid gap-3 md:mt-auto md:pt-8">
                <SignupBars />
                <TypedInsight />
              </div>
            </Card>
          </div>

          {[anomaly, alerts].map((f) => (
            <div data-reveal key={f.key}>
              <Card spotlight className="flex h-full flex-col p-6">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{f.text}</p>
                <div className="mt-6 md:mt-auto md:pt-6">{f.key === "anomaly" ? <AnomalyVisual /> : <AlertsVisual />}</div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
