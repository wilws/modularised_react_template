import { DocPage, translateEntry, type DocEntry } from "../../../../app/components";
import { useModuleTranslation } from "../../../../app/locales";
import { modulesDocsLocale } from "../../locales";

/**
 * Renders one documentation entry. The content file holds message ids, so the
 * page translates with the rest of the app.
 */
export const DocSection = ({ entry }: { entry: DocEntry }) => {
  const { t } = useModuleTranslation(modulesDocsLocale);

  return <DocPage {...translateEntry(entry, t as (id: string) => string)} />;
};
