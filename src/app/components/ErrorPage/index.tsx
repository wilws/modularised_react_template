import { Link } from "react-router-dom";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button, Stack, Text, Title } from "../Basic";
import { useTranslation } from "../../locales";

/**
 * Router-level error boundary. Renders for unmatched paths (404) and for any
 * error thrown by a module loader or element.
 */
export const ErrorPage = () => {
  const error = useRouteError();
  const { t } = useTranslation();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <Stack align="center" justify="center" gap="sm" mih="60svh" p="md">
      <Title order={1} ta="center">
        {isNotFound ? t("error.notFound.title") : t("error.generic.title")}
      </Title>
      <Text ta="center">
        {isNotFound ? t("error.notFound.body") : t("error.generic.body")}
      </Text>
      <Button component={Link} to="/" mt="xs" variant="light">
        {t("action.backHome")}
      </Button>
    </Stack>
  );
};
