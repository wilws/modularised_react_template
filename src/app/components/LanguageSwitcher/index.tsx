import { Select } from "../Basic";
import { useTranslation } from "../../locales";
import { langFlagMap, type LangKey } from "../../providers/lang";

export const LanguageSwitcher = () => {
  const { t, langKey, setLangKey, langKeyList } = useTranslation();

  return (
    <Select
      size="xs"
      w={150}
      aria-label={t("lang.label")}
      value={langKey}
      allowDeselect={false}
      onChange={(value) => value && setLangKey(value as LangKey)}
      data={Object.entries(langKeyList).map(([value, label]) => ({
        value,
        label: `${langFlagMap[value as LangKey]}  ${label}`,
      }))}
    />
  );
};
