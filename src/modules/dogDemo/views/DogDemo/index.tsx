import {
  Alert,
  Anchor,
  Badge,
  Button,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "../../../../app/components/Basic";
import { CodeBlock } from "../../../../app/components";
import { useModuleTranslation } from "../../../../app/locales";
import { BreedList } from "../../components/BreedList";
import { useBreeds } from "../../hooks";
import {
  flowSample,
  hookSample,
  registerSample,
  routerSample,
  schemaSample,
  serviceSample,
  structureSample,
  viewSample,
} from "../../content";
import { dogLocale } from "../../locales";

const API_DOCS = "https://dog.ceo/dog-api/breeds-list";

export const DogDemo = () => {
  const { t } = useModuleTranslation(dogLocale);

  // All the loading/error/result state lives in the module's own hook.
  const { breeds, photo, loading, error, load } = useBreeds(t("dog.error.schema"));

  return (
    <Stack gap="xl" maw={820}>
      <Stack align="flex-start" gap="sm">
        <Badge variant="light">live demo</Badge>
        <Title order={1} size="h2">
          {t("dog.title")}
        </Title>
        <Text c="dimmed">{t("dog.intro")}</Text>
        <Anchor href={API_DOCS} target="_blank" rel="noreferrer" size="sm">
          {API_DOCS}
        </Anchor>
      </Stack>

      <Divider />

      {/* ---- the live call ---- */}
      <Stack gap="sm">
        <Group>
          <Button onClick={load} loading={loading}>
            {loading ? t("dog.loading") : t("dog.button")}
          </Button>
          {breeds.length > 0 && (
            <Text size="sm" c="dimmed">
              {t("dog.count", { count: breeds.length })}
            </Text>
          )}
        </Group>

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        {photo && (
          <Stack gap={4} align="flex-start">
            <Text size="xs" c="dimmed">
              {t("dog.photo")}
            </Text>
            <Image src={photo} alt="" w={200} radius="md" />
          </Stack>
        )}

        {breeds.length > 0 && <BreedList breeds={breeds} />}
      </Stack>

      <Divider />

      {/* ---- the code ---- */}
      <Stack gap="xs">
        <Title order={2} size="h4">
          {t("dog.structure")}
        </Title>
        <CodeBlock>{structureSample}</CodeBlock>
      </Stack>

      <Stack gap="xs">
        <Title order={2} size="h4">
          {t("dog.flow")}
        </Title>
        <CodeBlock>{flowSample}</CodeBlock>
      </Stack>

      <Stack gap="xs">
        <Title order={2} size="h4">
          {t("dog.serviceCode")}
        </Title>
        <CodeBlock path="src/services/api/dog/schema.ts">{schemaSample}</CodeBlock>
        <CodeBlock path="src/services/api/dog/index.ts">{serviceSample}</CodeBlock>
        <CodeBlock path="src/services/api/index.ts">{registerSample}</CodeBlock>
      </Stack>

      <Stack gap="xs">
        <Title order={2} size="h4">
          {t("dog.moduleCode")}
        </Title>
        <CodeBlock path="src/modules/dogDemo/hooks/useBreeds.ts">
          {hookSample.replace(/^\/\* [^*]+ \*\/\n/, "")}
        </CodeBlock>
        <CodeBlock path="src/modules/dogDemo/views/DogDemo/index.tsx">
          {viewSample.replace(/^\/\* [^*]+ \*\/\n/, "")}
        </CodeBlock>
        <CodeBlock path="src/modules/dogDemo/router/index.tsx">
          {routerSample}
        </CodeBlock>
      </Stack>
    </Stack>
  );
};
