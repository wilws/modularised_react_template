import { DocPage, type DocEntry } from "../../../../app/components";

/**
 * Renders one documentation entry. The route supplies which one, so a single
 * view serves every section in the module.
 */
export const DocSection = ({ entry }: { entry: DocEntry }) => (
  <DocPage
    title={entry.title}
    path={entry.path}
    intro={entry.intro}
    blocks={entry.blocks}
  />
);
