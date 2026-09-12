import type { LangKey } from "../providers/lang";

/** A flat dictionary of message id -> text for one language. */
export type Messages = Record<string, string>;

/**
 * A locale bundle: every supported language must be present, so a missing
 * translation is a type error rather than a runtime fallback.
 *
 * `T` is the message map of the reference language (EN), which makes the
 * message ids literal and gives `t()` autocomplete.
 */
export type LocaleBundle<T extends Messages> = Record<LangKey, T>;

/** Helper that infers the message ids from the EN entry of a bundle. */
export const defineLocale = <T extends Messages>(
  bundle: LocaleBundle<T>,
): LocaleBundle<T> => bundle;
