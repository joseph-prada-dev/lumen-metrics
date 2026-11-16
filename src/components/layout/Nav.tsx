"use client";

import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const BLUR_AFTER = 40;
const HIDE_AFTER = 160;

export function Nav() {
  const header = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  const { contextSafe } = useGSAP(
    () => {
      const el = header.current!;
      const slide = gsap.quickTo(el, "yPercent", { duration: 0.45, ease: "power3.out" });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > BLUR_AFTER);
          // Hide on scroll down, reveal on scroll up. Never hide while the menu is open.
          const hide = y > HIDE_AFTER && self.direction === 1 && !openRef.current;
          slide(hide ? -100 : 0);
        },
      });
    },
    { scope: header },
  );

  // Keyboard users tabbing into a hidden nav should always see it.
  const reveal = contextSafe(() => gsap.to(header.current, { yPercent: 0, duration: 0.3, overwrite: true }));

  return (
    <header ref={header} onFocusCapture={reveal} className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open
            ? "border-border bg-surface/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a href="#top" aria-label="Lumen Metrics, back to top" className="rounded-md">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <Button href={nav.signIn.href} variant="ghost" size="sm" className="max-sm:hidden">
              {nav.signIn.label}
            </Button>
            <Button href={nav.cta.href} size="sm">
              {nav.cta.label}
            </Button>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg md:hidden"
            >
              {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <div id="mobile-menu" hidden={!open} className="border-t border-border md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-3">
            {[...nav.links, nav.signIn].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-[15px] text-muted hover:text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
