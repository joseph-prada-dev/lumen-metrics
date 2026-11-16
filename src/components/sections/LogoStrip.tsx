import type { ReactNode } from "react";
import { logoStrip } from "@/lib/content";

/** Simple fictional marks: a tiny SVG glyph + wordmark, each with its own type treatment. */
const marks: Record<string, { glyph: ReactNode; className: string }> = {
  Northwind: {
    glyph: <path d="M2 18 L12 4 L22 18 Z M8 18 L12 12 L16 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
    className: "font-display font-semibold tracking-[-0.02em]",
  },
  Arcflow: {
    glyph: <path d="M3 18 A9 9 0 0 1 21 18 M8 18 A4 4 0 0 1 16 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
    className: "font-sans font-medium italic tracking-[-0.01em]",
  },
  Quanta: {
    glyph: (
      <g fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" opacity="0.6" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" opacity="0.6" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </g>
    ),
    className: "font-display font-bold uppercase tracking-[0.12em] text-[15px]",
  },
  "Helix Labs": {
    glyph: <path d="M6 3 C18 8 6 16 18 21 M18 3 C6 8 18 16 6 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    className: "font-sans font-semibold tracking-[-0.02em]",
  },
  Parallel: {
    glyph: (
      <g fill="currentColor">
        <rect x="4" y="3" width="5" height="18" rx="1" transform="skewX(-12)" />
        <rect x="13" y="3" width="5" height="18" rx="1" transform="skewX(-12)" />
      </g>
    ),
    className: "font-display font-medium tracking-[0.02em]",
  },
  Corebase: {
    glyph: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      </g>
    ),
    className: "font-sans font-bold tracking-[-0.03em]",
  },
};

function LogoRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20" aria-hidden={hidden || undefined}>
      {logoStrip.companies.map((name) => (
        <li key={name} className="flex items-center gap-2 text-[17px] whitespace-nowrap text-fg">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            {marks[name]?.glyph}
          </svg>
          <span className={marks[name]?.className}>{name}</span>
        </li>
      ))}
    </ul>
  );
}

export function LogoStrip() {
  return (
    <section aria-labelledby="logos-title" className="py-12 md:py-16">
      <h2 id="logos-title" className="text-center text-[13px] font-medium text-muted">
        {logoStrip.label}
      </h2>
      <div className="marquee mt-8 opacity-50 transition-opacity duration-300 hover:opacity-70">
        <div className="marquee-track">
          <LogoRow />
          <LogoRow hidden />
        </div>
      </div>
    </section>
  );
}
