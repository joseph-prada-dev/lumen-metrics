import { Sparkles } from "lucide-react";
import { dashboard } from "@/lib/content";
import { cn } from "@/lib/cn";

/* --------------------------------------------------------------- Chart math
   Pure + deterministic, so server and client markup are identical. */

const VB_W = 640;
const VB_H = 260;
const PAD_X = 10;
const PAD_T = 16;
const PAD_B = 16;
const Y_MIN = 21;
const Y_MAX = 36;

type Pt = [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

function toPoints(values: number[]): Pt[] {
  const step = (VB_W - PAD_X * 2) / (values.length - 1);
  const plotH = VB_H - PAD_T - PAD_B;
  return values.map((v, i) => [r1(PAD_X + i * step), r1(PAD_T + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * plotH)]);
}

/** Catmull-Rom → cubic Bézier for a smooth line through every point. */
function smoothPath(pts: Pt[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [r1(p1[0] + (p2[0] - p0[0]) / 6), r1(p1[1] + (p2[1] - p0[1]) / 6)];
    const c2: Pt = [r1(p2[0] - (p3[0] - p1[0]) / 6), r1(p2[1] - (p3[1] - p1[1]) / 6)];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const actualPts = toPoints(dashboard.series);
const linePath = smoothPath(actualPts);
const expectedPath = smoothPath(toPoints(dashboard.expected));
const areaPath = `${linePath} L${actualPts.at(-1)![0]},${VB_H - PAD_B} L${actualPts[0][0]},${VB_H - PAD_B} Z`;
const anomaly = actualPts[dashboard.anomalyIndex];
const anomalyXPct = (anomaly[0] / VB_W) * 100;
const gridYs = [0, 1, 2, 3].map((i) => r1(PAD_T + (i * (VB_H - PAD_T - PAD_B)) / 3));

/* ------------------------------------------------------------- Component */

export function DashboardMock() {
  return (
    <div
      role="img"
      aria-label={dashboard.a11yLabel}
      className="dash-frame relative rounded-[18px] border border-border bg-surface/80 p-1.5 backdrop-blur-sm"
    >
      <div className="overflow-hidden rounded-[14px] border border-border bg-surface-2">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="mx-auto hidden rounded-md border border-border bg-white/[0.03] px-3 py-1 text-[11px] text-muted sm:block">
            {dashboard.url}
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-success sm:ml-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </div>
        </div>

        <div className="grid gap-4 p-3 sm:p-5 md:grid-cols-[1fr_230px] md:p-6">
          {/* Chart card */}
          <div className="min-w-0 rounded-card border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-muted">{dashboard.title}</p>
                <p className="font-display text-2xl font-semibold tracking-[-0.02em]">{dashboard.total}</p>
              </div>
              <div className="flex rounded-full border border-border p-0.5 text-[11px]">
                {dashboard.range.map((r) => (
                  <span
                    key={r}
                    className={cn(
                      "rounded-full px-2.5 py-1",
                      r === dashboard.activeRange ? "bg-white/[0.08] text-fg" : "text-muted",
                    )}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 flex gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded bg-accent" /> Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-t border-dashed border-white/30" /> Expected
              </span>
            </div>

            {/* Chart */}
            <div className="relative mt-3">
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
                <defs>
                  <linearGradient id="dash-line" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#7C5CFF" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                  <linearGradient id="dash-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {gridYs.map((y) => (
                  <line key={y} x1="0" x2={VB_W} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
                ))}

                <path data-chart="area" d={areaPath} fill="url(#dash-area)" />
                <path
                  data-chart="expected"
                  d={expectedPath}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <path
                  data-chart="line"
                  d={linePath}
                  fill="none"
                  stroke="url(#dash-line)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="0"
                />

                <g data-chart="marker">
                  <line
                    x1={anomaly[0]}
                    x2={anomaly[0]}
                    y1={PAD_T}
                    y2={VB_H - PAD_B}
                    stroke="rgba(245,158,11,0.35)"
                    strokeDasharray="3 4"
                  />
                  <circle data-chart="ring" cx={anomaly[0]} cy={anomaly[1]} r="6" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx={anomaly[0]} cy={anomaly[1]} r="9" fill="rgba(245,158,11,0.18)" />
                  <circle cx={anomaly[0]} cy={anomaly[1]} r="4.5" fill="#F59E0B" stroke="#0E1016" strokeWidth="2" />
                </g>
              </svg>

              {/* X-axis labels (HTML so they stay legible at any width) */}
              <div className="relative mt-2 h-4 text-[10px] text-muted" aria-hidden="true">
                {dashboard.labels.map((label, i) => (
                  <span
                    key={i}
                    className={cn(
                      "absolute -translate-x-1/2",
                      i % 2 === 1 && i !== dashboard.anomalyIndex && "hidden sm:inline",
                      i === dashboard.anomalyIndex && "font-medium text-alert",
                    )}
                    style={{ left: `${(actualPts[i][0] / VB_W) * 100}%` }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Insight card: overlays the chart on large screens, stacks below otherwise */}
              <div
                data-chart="insight"
                className="mt-4 rounded-xl border border-alert/30 bg-[#12141B]/95 p-3.5 text-[13px] leading-snug shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md lg:absolute lg:top-[3%] lg:mt-0 lg:w-[270px] lg:-translate-x-1/2"
                style={{ left: `${anomalyXPct}%` }}
              >
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-alert">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {dashboard.insight.label}
                </div>
                <p className="font-semibold text-fg">{dashboard.insight.title}</p>
                <p className="mt-1 text-muted">
                  <span className="text-fg/80">Cause:</span> {dashboard.insight.cause}
                </p>
                <p className="mt-0.5 text-muted">
                  <span className="text-fg/80">Impact:</span> <span className="text-alert">{dashboard.insight.impact}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Side column */}
          <div className="grid content-start gap-3 sm:grid-cols-2 md:grid-cols-1">
            {dashboard.kpis.map((k) => {
              return (
                <div key={k.label} data-chart="kpi" className="rounded-card border border-border bg-surface p-4">
                  <p className="text-[12px] text-muted">{k.label}</p>
                  <div className="mt-1 flex items-baseline justify-between gap-2">
                    <p className="font-display text-xl font-semibold tracking-[-0.02em]">{k.value}</p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                        k.good ? "bg-success/10 text-success" : "bg-alert/10 text-alert",
                      )}
                    >
                      {k.trend === "up" ? "▲" : "▼"} {k.delta}
                    </span>
                  </div>
                </div>
              );
            })}

            <div data-chart="kpi" className="hidden rounded-card border border-border bg-surface p-4 md:block">
              <p className="text-[12px] text-muted">Live checks</p>
              <ul className="mt-2 space-y-2">
                {dashboard.checks.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate text-fg/90">{c.label}</span>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        c.status === "anomaly" ? "bg-alert" : "bg-success",
                      )}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
