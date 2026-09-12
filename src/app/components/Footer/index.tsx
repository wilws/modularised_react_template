import { Anchor, Group, Text } from "../Basic";
import { useTranslation } from "../../locales";
import { REPO_URL, AUTHOR_NAME, AUTHOR_URL } from "../../config";
import style from "./index.module.scss";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Group component="footer" className={style.footer} justify="space-between">
      <Text size="sm" c="dimmed">
        {t("footer.author")}{" "}
        <Anchor href={AUTHOR_URL} target="_blank" rel="noreferrer" size="sm">
          {AUTHOR_NAME}
        </Anchor>
      </Text>
      <Anchor href={REPO_URL} target="_blank" rel="noreferrer" size="sm">
        {t("footer.repo")}
      </Anchor>
    </Group>
  );
};
