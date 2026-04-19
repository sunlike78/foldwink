import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-base transition-colors select-none disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-[#9ed4ff] active:bg-[#b3deff]",
  secondary:
    "bg-surfaceHi text-text hover:bg-[#2a2f39] active:bg-[#323845] border border-[#2e343f]",
  ghost: "bg-transparent text-text hover:bg-surfaceHi",
  danger: "bg-danger text-white hover:bg-[#ef7a7a] active:bg-[#f58d8d]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
});
