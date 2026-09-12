import { NavLink as RouterNavLink } from "react-router-dom";
import { Anchor, Group, Title } from "../Basic";
import { useTranslation } from "../../locales";
import { LanguageSwitcher } from "../LanguageSwitcher";
import style from "./index.module.scss";

/**
 * Navigation lives here, in the app shell. Modules never render their own
 * top-level nav — they only expose routes.
 */
const navItems = [{ to: "/", labelId: "nav.home", end: true }] as const;

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
        {navItems.map(({ to, labelId, end }) => (
          <Anchor
            key={to}
            component={RouterNavLink}
            to={to}
            end={end}
            size="sm"
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
