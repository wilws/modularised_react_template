import { Stack, Text } from "../Basic";
import { useTranslation } from "../../locales";
import style from "./index.module.scss";

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Stack component="footer" className={style.footer} gap={4}>
      <Text size="sm">
        © {year} {t("app.title")}. {t("footer.rights")}
      </Text>
      <Text size="sm" c="dimmed">
        {t("footer.builtWith")}
      </Text>
    </Stack>
  );
};
