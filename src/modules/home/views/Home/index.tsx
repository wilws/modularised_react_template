import { Link } from "react-router-dom";
import {
  Anchor,
  Badge,
  Button,
  Code,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from "../../../../app/components/Basic";
import { useModuleTranslation } from "../../../../app/locales";
import { AUTHOR_NAME, AUTHOR_URL, REPO_URL } from "../../../../app/config";
import { StructureTree } from "../../components/StructureTree";
import { homeLocale } from "../../locales";
import style from "./index.module.scss";

const rules = [
  { id: "home.rules.one", why: "home.rules.one.why" },
  { id: "home.rules.two", why: "home.rules.two.why" },
  { id: "home.rules.three", why: "home.rules.three.why" },
  { id: "home.rules.four", why: "home.rules.four.why" },
  { id: "home.rules.five", why: "home.rules.five.why" },
] as const;

export const Home = () => {
  const { t } = useModuleTranslation(homeLocale);

  return (
    <Stack gap="xl" maw={820}>
      <Stack align="flex-start" gap="sm">
        <Badge variant="light">React 19 · Vite · TypeScript</Badge>
        <Title order={1}>{t("home.hero.title")}</Title>
        <Text size="lg">{t("home.hero.subtitle")}</Text>

        <Text size="sm" c="dimmed">
          by{" "}
          <Anchor href={AUTHOR_URL} target="_blank" rel="noreferrer">
            {AUTHOR_NAME}
          </Anchor>{" "}
          ·{" "}
          <Anchor href={REPO_URL} target="_blank" rel="noreferrer">
            github.com/wilws/modularised_react_template
          </Anchor>
        </Text>

        <Button component={Link} to="/app" mt="xs">
          {t("home.hero.cta")}
        </Button>
      </Stack>

      <Stack gap="xs">
        <Title order={2}>{t("home.structure.title")}</Title>
        <Text>{t("home.structure.body")}</Text>
        <StructureTree />
      </Stack>

      <Stack gap="xs">
        <Title order={2}>{t("home.rules.title")}</Title>
        <List type="ordered" className={style.rules}>
          {rules.map(({ id, why }) => (
            <List.Item key={id}>
              <Text component="span" fw={500}>
                {t(id)}
              </Text>
              <Text size="sm" c="dimmed">
                {t(why)}
              </Text>
            </List.Item>
          ))}
        </List>
      </Stack>

      <Paper component="section" withBorder radius="md" p="lg">
        <Stack align="flex-start" gap="xs">
          <Title order={2}>{t("home.start.title")}</Title>
          <Text>{t("home.start.body")}</Text>
          <Code block>
            {`git clone ${REPO_URL}.git\ncd modularised_react_template\nnpm install\nnpm run dev`}
          </Code>
        </Stack>
      </Paper>

      <Stack gap="xs">
        <Title order={2}>{t("home.tour.title")}</Title>
        <Text>{t("home.tour.body")}</Text>
        <Group gap="xs" mt="xs">
          <Button component={Link} to="/app" variant="default" ff="monospace">
            app
          </Button>
          <Button component={Link} to="/modules" variant="default" ff="monospace">
            modules
          </Button>
          <Button component={Link} to="/services" variant="default" ff="monospace">
            services
          </Button>
          <Button component={Link} to="/demo" variant="light" ff="monospace">
            demo
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
};
