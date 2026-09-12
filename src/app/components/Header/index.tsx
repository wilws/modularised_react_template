import { NavLink as RouterNavLink } from "react-router-dom";
import { Anchor, Group, Title } from "../Basic";
import { useTranslation } from "../../locales";
import { LanguageSwitcher } from "../LanguageSwitcher";
import style from "./index.module.scss";

/**
 * Navigation lives here, in the app shell. Modules never render their own
 * top-level nav — they only expose routes.
 */
const navItems = [
  { to: "/app", labelId: "nav.app" },
  { to: "/modules", labelId: "nav.modules" },
  { to: "/services", labelId: "nav.services" },
] as const;

export const Header = () => {
  const { t } = useTranslation();

  return (
    <Group component="header" className={style.header} gap="lg" wrap="wrap">
      <Anchor component={RouterNavLink} to="/" underline="never">
        <Title order={1} size="h4">
          {t("app.title")}
        </Title>
      </Anchor>

      <Group component="nav" gap="md" style={{ marginInlineEnd: "auto" }}>
        {navItems.map(({ to, labelId }) => (
          <Anchor
            key={to}
            component={RouterNavLink}
            to={to}
            size="sm"
            ff="monospace"
            className={style.navLink}
          >
            {t(labelId)}
          </Anchor>
        ))}
      </Group>

      <LanguageSwitcher />
    </Group>
  );
};
