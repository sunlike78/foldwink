import { MAX_MISTAKES } from "../game/types/game";

interface Props {
  used: number;
}

export function MistakesDots({ used }: Props) {
  const dots = Array.from({ length: MAX_MISTAKES });
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Mistakes used ${used} of ${MAX_MISTAKES}`}
    >
      <span className="text-xs uppercase tracking-wide text-muted mr-1">Mistakes</span>
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
