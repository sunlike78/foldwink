import { useHapticSettings } from "../haptics/useHaptics";

interface Props {
  compact?: boolean;
}

export function HapticsToggle({ compact }: Props) {
  const { enabled, supported, toggle } = useHapticSettings();
  if (!supported) return null;
  const label = enabled ? "Haptics on" : "Haptics off";
  const icon = enabled ? "≋" : "✕";
  const classes = compact
    ? "inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-text transition-colors"
    : "inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors px-3 py-1.5 rounded-full border border-[#2e343f]";
  return (
    <button type="button" onClick={toggle} aria-pressed={enabled} className={classes}>
      <span aria-hidden="true" className="tabular-nums">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
