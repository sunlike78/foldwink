import { create } from "zustand";
import { strings, type Lang, type Strings } from "./strings";

const STORAGE_KEY = "foldwink:lang";

function isLang(v: unknown): v is Lang {
  return v === "en" || v === "de" || v === "ru";
}

function detectSystemLang(): Lang {
  try {
    const nav = navigator.language ?? "";
    if (nav.startsWith("de")) return "de";
    if (nav.startsWith("ru")) return "ru";
  } catch {}
  return "en";
}

export function getLangSync(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {}
  return detectSystemLang();
}

function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
}

interface LangStore {
  lang: Lang;
  t: Strings;
  setLang: (l: Lang) => void;
}

function applyDocumentLang(lang: Lang): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
}

export const useLangStore = create<LangStore>((set) => {
  const lang = getLangSync();
  applyDocumentLang(lang);
  return {
    lang,
    t: strings[lang],
    setLang: (lang) => {
      saveLang(lang);
      applyDocumentLang(lang);
      set({ lang, t: strings[lang] });
    },
  };
});

export function useLang(): Lang {
  return useLangStore((s) => s.lang);
}

export function useT(): Strings {
  return useLangStore((s) => s.t);
}
