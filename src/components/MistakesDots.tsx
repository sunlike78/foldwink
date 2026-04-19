import { MAX_MISTAKES } from "../game/types/game";
import { useT } from "../i18n/useLanguage";

interface Props {
  used: number;
}

export function MistakesDots({ used }: Props) {
  const t = useT();
  const dots = Array.from({ length: MAX_MISTAKES });
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
        return (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              consumed ? "bg-danger" : "bg-surfaceHi border border-[#2e343f]"
            }`}
          />
        );
      })}
    </div>
  );
}
