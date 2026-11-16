"use client";

import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { gsap, SplitText, useGSAP, DESKTOP, REDUCED_MOTION } from "@/lib/gsap";
import { hero } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { DashboardMock } from "@/components/ui/DashboardMock";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // `always` guarantees the callback runs at every breakpoint (matchMedia only
      // fires when at least one condition matches).
      mm.add({ always: "all", isDesktop: DESKTOP, reduce: REDUCED_MOTION }, (ctx) => {
        const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
        const reveal = q(".js-reveal");

        /* Reduced motion: final state, simple fade, no scroll-linked motion. */
        if (reduce) {
          gsap.set(reveal, { visibility: "visible" });
          gsap.from(reveal, { opacity: 0, duration: 0.5, ease: "none" });
          return;
        }

        const h1 = q("h1")[0];
        const split = SplitText.create(h1, { type: "words", wordsClass: "inline-block will-change-transform" });
        // Move the gradient from the wrapper span onto the split word(s) so it survives transforms.
        const accent = h1.querySelector<HTMLElement>("[data-accent]");
        if (accent) {
          accent.classList.remove("text-gradient");
          split.words.forEach((w) => accent.contains(w) && w.classList.add("text-gradient"));
        }

        const ring = q("[data-chart=ring]");
        const pulse = gsap.fromTo(
          ring,
          { scale: 1, opacity: 0.8 },
          { scale: 3, opacity: 0, duration: 1.6, ease: "power2.out", repeat: -1, paused: true, transformOrigin: "50% 50%" },
        );

        /* ---------------------------------------------- Load timeline */
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });

        tl.set(reveal, { visibility: "visible" })
          // 1. Eyebrow
          .from(q("[data-hero=eyebrow]"), { y: 12, opacity: 0, duration: 0.6 }, 0)
          // 2. Headline words: rise + blur → sharp
          .from(split.words, { yPercent: 55, opacity: 0, filter: "blur(10px)", duration: 0.8, stagger: 0.06 }, 0.1)
          // 3. Sub, CTAs, proof
          .from(q("[data-hero=fade]"), { y: 16, opacity: 0, stagger: 0.08 }, 0.45)
          // 4. Dashboard rises with a 3D tilt
          .from(
            q("[data-hero=dash-inner]"),
            {
              y: isDesktop ? 80 : 40,
              rotateX: isDesktop ? 18 : 8,
              opacity: 0,
              transformPerspective: 1200,
              transformOrigin: "50% 0%",
              duration: 0.9,
            },
            0.55,
          )
          .from(q("[data-chart=kpi]"), { y: 12, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.95)
          // 5. Chart draws itself → marker pulses → insight slides in
          .fromTo(q("[data-chart=line]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 1.0)
          .from(q("[data-chart=expected]"), { opacity: 0, duration: 0.8 }, 1.0)
          .from(q("[data-chart=area]"), { opacity: 0, duration: 0.6 }, 1.8)
          .from(q("[data-chart=marker]"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.5 }, 1.75)
          .add(() => {
            pulse.play();
          }, 2.0)
          .from(q("[data-chart=insight]"), isDesktop ? { x: 24, opacity: 0, duration: 0.6 } : { y: 16, opacity: 0, duration: 0.6 }, 2.05);

        /* -------------------------------------------- Scroll-linked */
        gsap.fromTo(
          q("[data-hero=dash-outer]"),
          { scale: 0.92, rotateX: isDesktop ? 10 : 4, transformPerspective: 1200, transformOrigin: "50% 100%" },
          {
            scale: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: { trigger: q("[data-hero=dash-outer]")[0], start: "top bottom", end: "top 15%", scrub: true },
          },
        );

        // Glow drifts slower than the content (parallax).
        gsap.to(q("[data-hero=glow]"), {
          yPercent: 35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden px-4 pt-32 pb-20 sm:px-6 md:pt-40 md:pb-28"
    >
      {/* Background: drifting glow + masked grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-hero="glow" className="absolute inset-x-0 top-0 h-[900px]">
          <div className="hero-glow hero-glow--violet" />
          <div className="hero-glow hero-glow--cyan" />
        </div>
        <div className="hero-grid absolute inset-0" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="js-reveal mx-auto flex max-w-3xl flex-col items-center text-center">
          <a
            data-hero="eyebrow"
            href={hero.eyebrow.href}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] py-1 pr-3 pl-1 text-[13px] text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-bg">{hero.eyebrow.tag}</span>
            <span aria-hidden="true">·</span>
            {hero.eyebrow.text}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>

          <h1 id="hero-title" className="h1-display mt-6 text-balance">
            {hero.headline.before}{" "}
            <span data-accent className="text-gradient">
              {hero.headline.accent}
            </span>{" "}
            {hero.headline.after}
          </h1>

          <p data-hero="fade" className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted sm:text-lg">
            {hero.sub}
          </p>

          <div data-hero="fade" className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button href={hero.secondaryCta.href} variant="secondary">
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              {hero.secondaryCta.label}
            </Button>
          </div>

          <p data-hero="fade" className="mt-5 text-[13px] text-muted">
            {hero.proof.join(" · ")}
          </p>
        </div>

        <div className="js-reveal mt-16 md:mt-20">
          <div data-hero="dash-outer" className="will-change-transform">
            <div data-hero="dash-inner" className="will-change-transform">
              <DashboardMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
