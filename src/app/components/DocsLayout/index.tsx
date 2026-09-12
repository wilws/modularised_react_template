import { NavLink as RouterNavLink, Outlet } from "react-router-dom";
import { Anchor, Box, Stack, Text } from "../Basic";
import style from "./index.module.scss";

export interface DocsSection {
  /** Route segment, relative to the module's base path. */
  to: string;
  label: string;
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
      <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
        {title}
      </Text>
      <Stack gap={2}>
        {sections.map(({ to, label }) => (
          <Anchor
            key={to}
            component={RouterNavLink}
            to={to}
            end
            size="sm"
            ff="monospace"
            underline="never"
            className={style.link}
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
