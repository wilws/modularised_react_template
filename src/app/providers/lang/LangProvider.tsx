import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LangContext } from "./langContext";
import {
  LANG_STORAGE_KEY,
  langKeyList,
  langLocaleMap,
  resolveInitialLang,
  type ILangContext,
  type LangKey,
} from "./types";

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [langKey, setLangKey] = useState<LangKey>(resolveInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, langKey);
    } catch {
      /* ignore persistence failures */
    }
    document.documentElement.lang = langLocaleMap[langKey];
  }, [langKey]);

  const contextValue = useMemo<ILangContext>(
    () => ({
      langKey,
      setLangKey,
      langKeyList,
      locale: langLocaleMap[langKey],
    }),
    [langKey],
  );

  return (
    <LangContext.Provider value={contextValue}>{children}</LangContext.Provider>
  );
};
