interface Props {
  size?: number;
  animated?: boolean;
}

/**
 * The Foldwink brand mark — a 2×2 tile motif with a subtle accent star that
 * sits above the wordmark. When `animated`, the top-right tile gently fades
 * on a slow cycle, suggesting the Foldwink Tabs reveal.
 */
export function BrandMark({ size = 56, animated = false }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="14" fill="#181b22" />
      <rect x="9" y="9" width="20" height="20" rx="4" fill="#f5c86b" />
      <rect
        x="35"
        y="9"
        width="20"
        height="20"
        rx="4"
        fill="#8cd28e"
        style={animated ? { animation: "fw-tab-fade 3.4s ease-in-out infinite" } : undefined}
      />
      <rect x="9" y="35" width="20" height="20" rx="4" fill="#ef9e9e" />
      <rect x="35" y="35" width="20" height="20" rx="4" fill="#b49cf0" />
      <circle cx="32" cy="32" r="3" fill="#7cc4ff" />
    </svg>
  );
}
