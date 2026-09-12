import { NavLink as RouterNavLink, Outlet } from "react-router-dom";
import { Anchor, Box, Stack } from "../Basic";
import style from "./index.module.scss";

export interface DocsSection {
  /** Route segment, relative to the module's base path. */
  to: string;
  label: string;
  /** Renders indented under the section above it. */
  nested?: boolean;
}

interface DocsLayoutProps {
  title: string;
  sections: DocsSection[];
}

/**
 * Two-column docs shell: a left menu of sections, and the active section on
 * the right. Shared by every docs module, so each one only supplies its list.
 */
export const DocsLayout = ({ title, sections }: DocsLayoutProps) => (
  <Box className={style.docs}>
    <Box component="aside" className={style.sidebar}>
      <Box className={style.title}>{title}/</Box>

      <Stack gap={2} mt={8}>
        {sections.map(({ to, label, nested }) => (
          <Anchor
            key={to}
            component={RouterNavLink}
            to={to}
            end
            underline="never"
            className={nested ? `${style.link} ${style.nested}` : style.link}
          >
            {label}
          </Anchor>
        ))}
      </Stack>
    </Box>

    <Box className={style.content}>
      <Outlet />
    </Box>
  </Box>
);
