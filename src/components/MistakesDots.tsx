import { MAX_MISTAKES } from "../game/types/game";
import { useT } from "../i18n/useLanguage";

interface Props {
  used: number;
  /** When true, the most recently consumed dot is tinted amber (not red).
   *  Consumed in parent (`GameScreen`) while `flash === "one-away"` so the
   *  player ties "this cost a mistake but you were close" to the same
   *  visual field as the mistakes strip. Pure CSS, ~900 ms lifetime,
   *  settles to red when the flash clears. */
  oneAwayLast?: boolean;
}

export function MistakesDots({ used, oneAwayLast = false }: Props) {
  const t = useT();
  const dots = Array.from({ length: MAX_MISTAKES });
  const lastConsumedIdx = used - 1;
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={t.game.mistakesAria(used, MAX_MISTAKES)}
    >
      <span className="text-xs uppercase tracking-wide text-muted mr-1">
        {t.game.mistakesLabel}
      </span>
      {dots.map((_, i) => {
        const consumed = i < used;
        const amber = consumed && oneAwayLast && i === lastConsumedIdx;
        return (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              consumed
                ? amber
                  ? "bg-[#e0b25e]"
                  : "bg-danger"
                : "bg-surfaceHi border border-[#2e343f]"
            }`}
          />
        );
      })}
    </div>
  );
}
