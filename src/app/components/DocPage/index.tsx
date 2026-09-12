import type { ReactNode } from "react";
import { Box, List, Stack, Text, Title } from "../Basic";
import { CodeBlock } from "../CodeBlock";
import style from "./index.module.scss";

/** One documentation page, described as data. */
export interface DocEntry {
  /** Route segment; empty string means the section's index page. */
  slug: string;
  title: string;
  path: string;
  intro: string;
  blocks: DocBlock[];
}

export interface DocBlock {
  heading?: string;
  body?: string;
  code?: string;
  bullets?: string[];
}

interface DocPageProps {
  title: string;
  path: string;
  intro: string;
  blocks: DocBlock[];
  children?: ReactNode;
}

/**
 * A sample whose first line is a `/* path *\/` comment shows that path as the
 * block's caption instead of repeating it inside the code.
 */
const CodeSample = ({ code }: { code: string }) => {
  // Only a real file path is lifted — a commented note like "✅ do this"
  // stays in the code where it belongs.
  const match = code.match(/^\/\* (src\/[\w./<>-]+) \*\/\n/);
  return match ? (
    <CodeBlock path={match[1]}>{code.slice(match[0].length)}</CodeBlock>
  ) : (
    <CodeBlock>{code}</CodeBlock>
  );
};

/**
 * Renders one documentation page from plain data, so a docs module only has
 * to describe its content — never lay it out.
 */
export const DocPage = ({ title, path, intro, blocks, children }: DocPageProps) => (
  <Stack gap={40}>
    <Stack gap={10}>
      <Box className={style.path}>{path}</Box>
      <Title order={1} className={style.title}>
        {title}
      </Title>
      <Text className={style.intro}>{intro}</Text>
    </Stack>

    {blocks.map((block, index) => (
      <Stack key={block.heading ?? index} gap={12}>
        {block.heading && (
          <Title order={2} className={style.heading}>
            {block.heading}
          </Title>
        )}

        {block.body && <Text className={style.body}>{block.body}</Text>}

        {block.bullets && (
          <List className={style.bullets}>
            {block.bullets.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
        )}

        {block.code && <CodeSample code={block.code} />}
      </Stack>
    ))}

    {children}
  </Stack>
);
