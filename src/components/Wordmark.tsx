import { BrandMark } from "./BrandMark";

interface Props {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  subtitle?: string;
  /** Show the "by Neural Void" sublabel under the wordmark. Default: true on lg. */
  showSublabel?: boolean;
}

const TITLE_CLS: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-2xl sm:text-3xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl",
};

const MARK_PX: Record<NonNullable<Props["size"]>, number> = {
  sm: 32,
  md: 52,
  lg: 64,
};

/**
 * The Foldwink wordmark lockup: brand mark + wordmark + accent underline +
 * optional "by Neural Void" sublabel. One place, one lockup, reused on
 * Menu / Stats / Onboarding.
 */
export function Wordmark({ size = "md", animated = false, subtitle, showSublabel }: Props) {
  const sublabelOn = showSublabel ?? size === "lg";
  return (
    <div className="flex flex-col items-center text-center">
      <BrandMark size={MARK_PX[size]} animated={animated} />
      <h1 className={`mt-3 font-extrabold tracking-tight leading-none ${TITLE_CLS[size]}`}>
        Foldwink
      </h1>
      <div className="mt-2 h-[3px] w-14 rounded-full bg-accent/70" aria-hidden="true" />
      {sublabelOn && (
        <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted">
          by Neural Void
        </div>
      )}
      {subtitle && <p className="mt-3 text-muted text-sm max-w-xs">{subtitle}</p>}
    </div>
  );
}
