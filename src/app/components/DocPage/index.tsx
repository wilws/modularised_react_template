import type { ReactNode } from "react";
import { Code, Divider, List, Paper, Stack, Text, Title } from "../Basic";

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
 * Renders one documentation page from plain data, so a docs module only has
 * to describe its content — never lay it out.
 */
export const DocPage = ({ title, path, intro, blocks, children }: DocPageProps) => (
  <Stack gap="lg">
    <Stack gap={6}>
      <Code>{path}</Code>
      <Title order={1} size="h2">
        {title}
      </Title>
      <Text c="dimmed">{intro}</Text>
    </Stack>

    <Divider />

    {blocks.map((block, index) => (
      <Stack key={block.heading ?? index} gap="xs">
        {block.heading && <Title order={2} size="h4">{block.heading}</Title>}
        {block.body && <Text>{block.body}</Text>}
        {block.bullets && (
          <List spacing={4} size="sm">
            {block.bullets.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
        )}
        {block.code && (
          <Paper withBorder radius="sm" p={0}>
            <Code block>{block.code}</Code>
          </Paper>
        )}
      </Stack>
    ))}

    {children}
  </Stack>
);
