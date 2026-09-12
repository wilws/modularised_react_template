import { createContext, useContext } from "react";
import type { ILangContext } from "./types";

export const LangContext = createContext<ILangContext | undefined>(undefined);

export const useLangContext = (): ILangContext => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLangContext must be used within a <LangProvider>");
  }
  return context;
};
