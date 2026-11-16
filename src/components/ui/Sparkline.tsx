import { cn } from "@/lib/cn";

const W = 100;
const H = 32;
const PAD = 3;

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Deterministic pseudo-random series (same output on server and client). */
export function makeSeries(seed: number, length = 16, shape: "flat" | "drop" | "spike" = "flat"): number[] {
  return Array.from({ length }, (_, i) => {
    let v = 10 + Math.sin(i * 0.9 + seed) * 2.2 + (((i + 1) * (seed + 3) * 7) % 5) * 0.45;
    if (shape === "drop" && i >= length - 3) v -= (i - (length - 4)) * 2.6;
    if (shape === "spike" && i === Math.floor(length * 0.65)) v += 9;
    return r2(v);
  });
}

export function sparkPath(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = W / (values.length - 1);
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${r2(i * step)},${r2(PAD + (1 - (v - min) / span) * (H - PAD * 2))}`)
    .join(" ");
}

type SparklineProps = {
  values: number[];
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

export function Sparkline({ values, className, stroke = "currentColor", strokeWidth = 1.5 }: SparklineProps) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" className={cn("block", className)}>
      <path
        d={sparkPath(values)}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
