import type { ReactNode } from "react";
import { Box } from "@mantine/core";
import style from "./List.module.scss";

interface ListProps {
  /** "unordered" renders <ul> with discs, "ordered" renders <ol> with numbers. */
  type?: "unordered" | "ordered";
  className?: string;
  children: ReactNode;
}

/**
 * A real <ul>/<ol>. Mantine's List wraps every item in a <div>, which kills
 * the native ::marker — so this overrides it with plain semantic markup and
 * lets the browser draw the bullets and numbers.
 */
export const List = ({ type = "unordered", className, children }: ListProps) => (
  <Box
    component={type === "ordered" ? "ol" : "ul"}
    className={className ? `${style.list} ${className}` : style.list}
  >
    {children}
  </Box>
);

/** One row. Any extra content (a note, a code snippet) just nests inside. */
List.Item = ({ children }: { children: ReactNode }) => <li>{children}</li>;
