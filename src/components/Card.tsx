import { SOLVED_COLOR_CLASSES, SOLVED_GROUP_MARKERS } from "../game/solvedColors";
import { MOTION_CLASS } from "../styles/motion";

interface Props {
  value: string;
  state: "idle" | "selected" | "solved";
  solvedColorIndex?: number;
  disabled?: boolean;
  onClick: () => void;
}

export function Card({ value, state, solvedColorIndex = 0, disabled, onClick }: Props) {
  const base =
    "relative w-full aspect-[3/2] flex items-center justify-center text-center p-2 rounded-xl font-semibold text-sm sm:text-base leading-tight select-none will-change-transform";
  const motion = `${MOTION_CLASS.baseTransition} ${MOTION_CLASS.press}`;

  let variant: string;
  if (state === "solved") {
    variant = `${SOLVED_COLOR_CLASSES[solvedColorIndex % SOLVED_COLOR_CLASSES.length]} ${MOTION_CLASS.solvedPop}`;
  } else if (state === "selected") {
    // Strong ring + lift so the selected state is unmistakable on mobile
    // at a glance. Previously the accent-blue background alone blended
    // into the dark grid at small viewport sizes.
    variant = `bg-accent text-bg ring-2 ring-accent ring-offset-2 ring-offset-bg shadow-[0_0_0_1px_rgba(255,255,255,0.2)] ${MOTION_CLASS.selectedLift}`;
  } else {
    variant = "bg-surface text-text hover:bg-surfaceHi border border-[#262a33]";
  }

  const classes = `${base} ${motion} ${variant}${disabled ? " pointer-events-none" : ""}`;
  const marker =
    state === "solved"
      ? SOLVED_GROUP_MARKERS[solvedColorIndex % SOLVED_GROUP_MARKERS.length]
      : null;

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={state === "selected"}
      aria-label={
        state === "solved" ? `${value} — solved, group ${solvedColorIndex + 1}` : value
      }
      onClick={onClick}
      disabled={disabled}
    >
      <span className="break-words">
        {marker && (
          <span className="mr-1 text-xs opacity-90" aria-hidden="true">
            {marker}
          </span>
        )}
        {value}
      </span>
    </button>
  );
}
