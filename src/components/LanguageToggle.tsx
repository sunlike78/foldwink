import { useLangStore } from "../i18n/useLanguage";
import { SUPPORTED_LANGS, type Lang } from "../i18n/strings";

const LABELS: Record<Lang, string> = { en: "EN", de: "DE", ru: "RU" };

export function LanguageToggle() {
  const { lang, setLang } = useLangStore();

  return (
    <div
      className="inline-flex items-center rounded-full border border-[#2e343f] overflow-hidden"
      role="group"
      aria-label="Language"
    >
      {SUPPORTED_LANGS.map((code, i) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={[
            "px-2.5 py-1 text-[11px] leading-none transition-colors",
            i > 0 ? "border-l border-[#2e343f]" : "",
            lang === code ? "text-text bg-[#2e343f]" : "text-muted hover:text-text",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}
