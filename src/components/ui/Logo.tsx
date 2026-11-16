import { useId } from "react";
import { cn } from "@/lib/cn";

export function LogoOrb({ className }: { className?: string }) {
  const id = "orb" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id={`${id}-core`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#B9A8FF" />
          <stop offset="45%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#7C5CFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill={`url(#${id}-halo)`} />
      <circle cx="16" cy="16" r="10" fill={`url(#${id}-core)`} />
      <circle cx="12.5" cy="12" r="2.6" fill="#fff" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoOrb className="h-7 w-7" />
      <span className="font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">Lumen</span>
    </span>
  );
}
