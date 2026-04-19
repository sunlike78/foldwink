import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { BrandMark } from "./BrandMark";
import { LanguageToggle } from "./LanguageToggle";
import { useT } from "../i18n/useLanguage";

interface Props {
  onDismiss: () => void;
}

export function Onboarding({ onDismiss }: Props) {
  const t = useT();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previousActive =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    closeBtnRef.current?.focus();

    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousActive?.focus?.();
    };
  }, [onDismiss]);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.onboarding.howToPlay}
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface border border-[#2e343f] p-5 shadow-2xl">
        <div className="flex justify-center mb-2">
          <LanguageToggle />
        </div>

        <div className="flex flex-col items-center text-center mb-3">
          <BrandMark size={36} />
          <h2 className="mt-2 text-xl font-extrabold">Foldwink</h2>
          <div className="text-[10px] uppercase tracking-[0.12em] text-muted mt-0.5">
            {t.onboarding.howToPlay}
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
          {t.onboarding.tabsHint}
        </div>

        <ul className="space-y-1.5 text-[13px] leading-snug text-text mb-4">
          <li>
            <span className="text-accent font-bold">·</span> {t.onboarding.rulePick}
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="font-semibold">{t.onboarding.ruleEasy}</span>{" "}
            {t.onboarding.ruleEasyBody}
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="font-semibold">{t.onboarding.ruleMedium}</span>{" "}
            {t.onboarding.ruleMediumBody}{" "}
            <span className="text-accent font-semibold">{t.onboarding.wink}</span>.
          </li>
          <li>
            <span className="text-accent font-bold">·</span>{" "}
            <span className="font-semibold">{t.onboarding.ruleMaster}</span>{" "}
            {t.onboarding.ruleMasterBody}
          </li>
        </ul>

        <Button onClick={onDismiss} className="w-full" ref={closeBtnRef}>
          {t.onboarding.gotIt}
        </Button>
      </div>
    </div>
  );
}
