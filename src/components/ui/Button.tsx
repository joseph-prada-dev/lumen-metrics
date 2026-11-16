import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AnchorProps = Common & { href: string } & Omit<ComponentProps<"a">, "className" | "children" | "href">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const base =
  "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out " +
  "active:translate-y-0 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-bg font-semibold hover:-translate-y-px " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_30px_-10px_rgba(124,92,255,0.7)] " +
    "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_10px_36px_-8px_rgba(34,211,238,0.6)]",
  secondary:
    "border border-border bg-white/[0.03] text-fg hover:-translate-y-px hover:border-border-strong hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
};

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as Omit<AnchorProps, keyof Common>)}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof Common>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
