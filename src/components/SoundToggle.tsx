import { useSoundSettings } from "../audio/useSound";

interface Props {
  compact?: boolean;
}

export function SoundToggle({ compact }: Props) {
  const { muted, toggleMute } = useSoundSettings();
  const label = muted ? "Sound off" : "Sound on";
  const icon = muted ? "✕" : "♪";
  const classes = compact
    ? "inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-text transition-colors"
    : "inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors px-3 py-1.5 rounded-full border border-[#2e343f]";
  return (
    <button type="button" onClick={toggleMute} aria-pressed={!muted} className={classes}>
      <span aria-hidden="true" className="tabular-nums">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
