import { Badge, Box, Group, Text } from "../../../../app/components/Basic";
import { useModuleTranslation } from "../../../../app/locales";
import type { Dog } from "../../../../services/api";
import { dogLocale } from "../../locales";
import style from "./index.module.scss";

/**
 * A component private to the dogDemo module. It receives already-validated
 * data — there is nothing to check here.
 */
export const BreedList = ({ breeds }: { breeds: Dog.IBreed[] }) => {
  const { t } = useModuleTranslation(dogLocale);

  return (
    <Box className={style.grid}>
      {breeds.map(({ name, subBreeds }) => (
        <Box key={name} className={style.item}>
          <Group gap={6} wrap="wrap">
            <Text fw={600} size="sm">
              {name}
            </Text>
            {subBreeds.length > 0 ? (
              subBreeds.map((sub) => (
                <Badge key={sub} size="xs" variant="light">
                  {sub}
                </Badge>
              ))
            ) : (
              <Text size="xs" c="dimmed">
                {t("dog.none")}
              </Text>
            )}
          </Group>
        </Box>
      ))}
    </Box>
  );
};
