import { useCallback, useMemo } from "react";
import { useLangContext } from "../providers/lang";
import { appLocale } from "./app";
import type { LocaleBundle, Messages } from "./types";

export { defineLocale } from "./types";
export type { LocaleBundle, Messages } from "./types";
export { appLocale } from "./app";

/** Values injected into `{placeholder}` slots. */
export type TranslateValues = Record<string, string | number>;

export type Translate<T extends Messages> = (
  id: keyof T,
  values?: TranslateValues,
) => string;

/** Replaces `{name}` slots; unknown slots are left intact so they stay visible. */
const interpolate = (template: string, values?: TranslateValues): string => {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
};

const createTranslator = <T extends Messages>(
  messages: T,
  fallback: T,
): Translate<T> =>
  (id, values) => {
    const template = messages[id] ?? fallback[id];
    if (template === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[locales] missing translation for "${String(id)}"`);
      }
      return String(id);
    }
    return interpolate(template, values);
  };

/**
 * App-level translations. Use inside `src/app` for shared chrome.
 */
export const useTranslation = () => {
  const { langKey, setLangKey, langKeyList, locale } = useLangContext();

  const t = useMemo(
    () => createTranslator(appLocale[langKey], appLocale.EN),
    [langKey],
  );

  return { t, langKey, setLangKey, langKeyList, locale };
};

/**
 * Module-level translations. Each module owns its own bundle and passes it in,
 * so module strings never have to be registered with the app.
 *
 * ```ts
 * const { t } = useModuleTranslation(homeLocale);
 * t("home.hero.title");
 * ```
 */
export const useModuleTranslation = <T extends Messages>(
  bundle: LocaleBundle<T>,
) => {
  const { langKey, locale } = useLangContext();

  const t = useMemo(
    () => createTranslator(bundle[langKey], bundle.EN),
    [bundle, langKey],
  );

  return { t, langKey, locale };
};

/** Locale-aware number/date helpers, so modules don't hardcode formats. */
export const useFormatters = () => {
  const { locale } = useLangContext();

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    [locale],
  );

  const formatDate = useCallback(
    (value: Date | number, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options).format(value),
    [locale],
  );

  return { formatNumber, formatDate, locale };
};
