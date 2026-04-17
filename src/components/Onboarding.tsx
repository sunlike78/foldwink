import { Button } from "./Button";
import { BrandMark } from "./BrandMark";

interface Props {
  onDismiss: () => void;
}

export function Onboarding({ onDismiss }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="How to play Foldwink"
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface border border-[#2e343f] p-5 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-3">
          <BrandMark size={36} />
          <h2 className="mt-2 text-xl font-extrabold">Foldwink</h2>
          <div className="text-[10px] uppercase tracking-[0.12em] text-muted mt-0.5">
            How to play
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-1 max-w-[240px] mx-auto" aria-hidden="true">
          <div className="rounded-md bg-surfaceHi border border-[#2e343f] px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-text">
            R··
          </div>
          <div className="rounded-md bg-surfaceHi border border-accent px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-accent">
            ✦ FLY
          </div>
          <div className="rounded-md bg-surfaceHi border border-[#2e343f] px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-text">
            B··
          </div>
          <div className="rounded-md bg-surfaceHi border border-[#2e343f] px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-text">
            S··
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-muted text-center mb-3">
          Tabs hint the 4 hidden categories
        </div>

        <ul className="space-y-1.5 text-[13px] leading-snug text-text mb-4">
          <li>
            <span className="text-accent font-bold">·</span> Pick 4 cards that share a category.
            4 mistakes and you&apos;re out.
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="font-semibold">Easy</span> — 16 cards, 4 groups, no tabs.
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="font-semibold">Medium</span> — tabs reveal letters as you solve. One
            free <span className="text-accent font-semibold">✦ Wink</span> unlocks any tab.
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="font-semibold">Master</span> — slower reveals, no Wink.
          </li>
        </ul>

        <Button onClick={onDismiss} className="w-full">
          Got it
        </Button>
      </div>
    </div>
  );
}
