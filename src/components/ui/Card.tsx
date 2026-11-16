"use client";

import type { ComponentProps, PointerEvent } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** Cursor-following radial highlight on the border + slight lift on hover. */
  spotlight?: boolean;
};

/** Base surface card: 14px radius, 1px hairline border, no heavy shadow. */
export function Card({ className, spotlight = false, onPointerMove, ...props }: CardProps) {
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };

  return (
    <div
      className={cn("rounded-card border border-border bg-surface", spotlight && "spotlight", className)}
      onPointerMove={spotlight ? handleMove : onPointerMove}
      {...props}
    />
  );
}
