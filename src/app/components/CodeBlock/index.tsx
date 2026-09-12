import { Box, Code, Text } from "../Basic";
import style from "./index.module.scss";

interface CodeBlockProps {
  /** Shown as a caption above the code, usually the file path. */
  path?: string;
  children: string;
}

/** A captioned, scrollable code sample. */
export const CodeBlock = ({ path, children }: CodeBlockProps) => (
  <Box className={style.wrap}>
    {path && (
      <Text component="div" className={style.caption}>
        {path}
      </Text>
    )}
    <Code block className={style.code}>
      {children}
    </Code>
  </Box>
);
