import { SOLVED_COLOR_CLASSES, SOLVED_GROUP_MARKERS } from "../game/solvedColors";
import { MOTION_CLASS } from "../styles/motion";

interface Props {
  value: string;
  state: "idle" | "selected" | "solved";
  solvedColorIndex?: number;
  disabled?: boolean;
  onClick: () => void;
  solvedAriaTemplate?: (value: string, group: number) => string;
}

export function Card({
  value,
  state,
  solvedColorIndex = 0,
  disabled,
  onClick,
  solvedAriaTemplate,
}: Props) {
  const base =
    "relative w-full aspect-[3/2] flex items-center justify-center text-center px-1.5 py-2 sm:px-2 rounded-xl font-semibold text-[13px] sm:text-base leading-tight select-none will-change-transform";
  const motion = `${MOTION_CLASS.baseTransition} ${MOTION_CLASS.press}`;

  let variant: string;
  if (state === "solved") {
    variant = `${SOLVED_COLOR_CLASSES[solvedColorIndex % SOLVED_COLOR_CLASSES.length]} ${MOTION_CLASS.solvedPop}`;
  } else if (state === "selected") {
    variant = `bg-accent text-bg ring-2 ring-accent ring-offset-2 ring-offset-bg shadow-[0_0_0_1px_rgba(255,255,255,0.2)] ${MOTION_CLASS.selectedLift}`;
  } else {
    variant = "bg-surface text-text hover:bg-surfaceHi border border-[#262a33]";
  }

  const classes = `${base} ${motion} ${variant}${disabled ? " pointer-events-none" : ""}`;
  const marker =
    state === "solved"
      ? SOLVED_GROUP_MARKERS[solvedColorIndex % SOLVED_GROUP_MARKERS.length]
      : null;

  const ariaLabel =
    state === "solved"
      ? solvedAriaTemplate
        ? solvedAriaTemplate(value, solvedColorIndex + 1)
        : `${value} — solved, group ${solvedColorIndex + 1}`
      : value;

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={state === "selected"}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="break-words hyphens-auto">
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
