import { toast } from "react-toastify";
import { Button, List, Stack, Text, Title } from "../../../../app/components/Basic";
import { useModuleTranslation } from "../../../../app/locales";
import { Counter } from "../../components/Counter";
import { homeLocale } from "../../locales";

export const Home = () => {
  const { t } = useModuleTranslation(homeLocale);

  return (
    <Stack gap="xl" maw={760}>
      <Stack align="flex-start" gap="sm">
        <Title order={1}>{t("home.hero.title")}</Title>
        <Text>{t("home.hero.subtitle")}</Text>
        <Button mt="xs" onClick={() => toast.info(t("home.rules.two"))}>
          {t("home.hero.cta")}
        </Button>
      </Stack>

      <Stack gap="xs">
        <Title order={2}>{t("home.rules.title")}</Title>
        <List spacing="xs">
          <List.Item>{t("home.rules.one")}</List.Item>
          <List.Item>{t("home.rules.two")}</List.Item>
          <List.Item>{t("home.rules.three")}</List.Item>
        </List>
      </Stack>

      <Counter />
    </Stack>
  );
};
