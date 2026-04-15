import { Button } from "./Button";
import { BrandMark } from "./BrandMark";

interface Props {
  onDismiss: () => void;
}

export function Onboarding({ onDismiss }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="How to play Foldwink"
    >
      <div className="w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-surface border border-[#2e343f] p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-4">
          <BrandMark size={44} />
          <h2 className="mt-3 text-2xl font-extrabold">Foldwink</h2>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted mt-1">
            How to play
          </div>
        </div>

        <div className="space-y-2 mb-4 max-w-[260px] mx-auto">
          <div className="grid grid-cols-2 gap-1.5" aria-hidden="true">
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
          <div className="grid grid-cols-4 gap-1" aria-hidden="true">
            <span className="aspect-square rounded bg-solved1" />
            <span className="aspect-square rounded bg-solved1" />
            <span className="aspect-square rounded bg-solved1" />
            <span className="aspect-square rounded bg-solved1" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
            <span className="aspect-square rounded bg-surfaceHi border border-[#2e343f]" />
          </div>
        </div>

        <ul className="space-y-2 text-sm text-text mb-5">
          <li>
            <span className="text-accent font-bold">·</span> Pick exactly 4 cards that share a
            category, then submit.
          </li>
          <li>
            <span className="text-accent font-bold">·</span> 4 mistakes and you&apos;re out. All
            4 groups solved and you win.
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="text-text font-semibold">Easy</span> builds confidence.{" "}
            <span className="text-text font-semibold">Medium</span> adds{" "}
            <span className="text-text font-semibold">Foldwink Tabs</span> — hidden category
            previews that reveal one letter per solve — and one{" "}
            <span className="text-accent font-semibold">✦ Wink</span> per puzzle to fully reveal
            a tab. <span className="text-text font-semibold">Master Challenge</span> slows the
            tabs and removes Wink entirely.
          </li>
          <li>
            <span className="text-accent font-bold">·</span> Medium unlocks after a few Easy
            wins. Master Challenge opens once you&apos;re comfortable with Medium.
          </li>
        </ul>

        <Button onClick={onDismiss} className="w-full">
          Got it
        </Button>
      </div>
    </div>
  );
}
