import type { Dispatch, SetStateAction } from "react";

/* --- Supported languages --- */
export const langKeyList = {
  EN: "English",
  JP: "日本語",
  ZH: "繁體中文",
  CN: "简体中文",
} as const;

export type LangKey = keyof typeof langKeyList;

/** BCP-47 tag per language, used for <html lang> and Intl formatting. */
export const langLocaleMap: Record<LangKey, string> = {
  EN: "en",
  JP: "ja",
  ZH: "zh-Hant",
  CN: "zh-Hans",
};

export const LANG_STORAGE_KEY = "app.langKey";

export const isLangKey = (value: unknown): value is LangKey =>
  typeof value === "string" && value in langKeyList;

/** Restore the last choice, else fall back to the browser language, else EN. */
export const resolveInitialLang = (): LangKey => {
  if (typeof window === "undefined") return "EN";

  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (isLangKey(stored)) return stored;
  } catch {
    /* localStorage can be unavailable (private mode, blocked cookies) */
  }

  const browser = window.navigator.language.toLowerCase();
  if (browser.startsWith("ja")) return "JP";
  if (browser.startsWith("zh")) {
    return /hant|tw|hk|mo/.test(browser) ? "ZH" : "CN";
  }
  return "EN";
};

/* --- Context shape --- */
export interface ILangContext {
  langKey: LangKey;
  setLangKey: Dispatch<SetStateAction<LangKey>>;
  langKeyList: typeof langKeyList;
  /** BCP-47 tag for the active language. */
  locale: string;
}
