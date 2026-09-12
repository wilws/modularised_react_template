import type { DocBlock, DocEntry } from "./index";

/**
 * Resolves a doc entry's message ids into text for the active language.
 *
 * Content files hold ids, never prose, so a docs module's pages translate
 * with the rest of the app. Code samples are passed through untouched — they
 * are the same in every language.
 */
export const translateEntry = (
  entry: DocEntry,
  t: (id: string) => string,
): {
  title: string;
  path: string;
  intro: string;
  blocks: DocBlock[];
} => ({
  title: t(entry.title),
  path: entry.path,
  intro: t(entry.intro),
  blocks: entry.blocks.map((block) => ({
    ...block,
    heading: block.heading ? t(block.heading) : undefined,
    body: block.body ? t(block.body) : undefined,
    bullets: block.bullets?.map((bullet) => t(bullet)),
  })),
});
