import { DocPage, type DocEntry } from "../../../../app/components";

export const DocSection = ({ entry }: { entry: DocEntry }) => (
  <DocPage
    title={entry.title}
    path={entry.path}
    intro={entry.intro}
    blocks={entry.blocks}
  />
);
