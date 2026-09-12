import { useState } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "../../../../app/components/Basic";
import { useFormatters, useModuleTranslation } from "../../../../app/locales";
import { homeLocale } from "../../locales";

/**
 * A component private to the home module — it lives beside the view that uses
 * it rather than in the shared app components folder.
 */
export const Counter = () => {
  const { t } = useModuleTranslation(homeLocale);
  const { formatNumber } = useFormatters();
  const [count, setCount] = useState(0);

  return (
    <Paper component="section" withBorder radius="md" p="lg">
      <Stack align="flex-start" gap="xs">
        <Title order={2}>{t("home.counter.label")}</Title>
        <Text>{t("home.counter.value", { count: formatNumber(count) })}</Text>
        <Group gap="xs" mt="xs">
          <Button onClick={() => setCount((value) => value + 1)}>
            {t("home.counter.increment")}
          </Button>
          <Button variant="default" onClick={() => setCount(0)}>
            {t("home.counter.reset")}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
