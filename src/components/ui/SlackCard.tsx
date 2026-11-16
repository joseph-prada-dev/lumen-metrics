import { ArrowUpRight, Hash } from "lucide-react";
import { howItWorks } from "@/lib/content";
import { cn } from "@/lib/cn";
import { LogoOrb } from "@/components/ui/Logo";

/** Slack-style message card carrying a Lumen insight. */
export function SlackCard({ className }: { className?: string }) {
  const s = howItWorks.slack;
  return (
    <div
      className={cn(
        "rounded-card border border-border-strong bg-[#14161D]/95 p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-1 text-[11px] text-muted">
        <Hash className="h-3 w-3" aria-hidden="true" />
        {s.channel.replace("#", "")}
      </div>
      <div className="flex gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg">
          <LogoOrb className="h-5 w-5" />
        </div>
        <div className="min-w-0 text-[12px] leading-snug sm:text-[13px]">
          <p className="flex items-center gap-1.5">
            <span className="font-semibold text-fg">{s.app}</span>
            <span className="rounded bg-white/[0.08] px-1 text-[9px] font-semibold tracking-wide text-muted">APP</span>
            <span className="text-[11px] text-muted">{s.time}</span>
          </p>
          <p className="mt-1 font-semibold text-fg">{s.title}</p>
          <p className="mt-0.5 text-fg/75">{s.body}</p>
          <p className="mt-1 text-success/90">{s.fix}</p>
          <span className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-border-strong bg-white/[0.04] px-2.5 py-1 text-[12px] font-medium text-fg">
            {s.cta}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
