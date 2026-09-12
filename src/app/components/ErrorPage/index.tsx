import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button, Stack, Text, Title } from "../Basic";
import { useTranslation } from "../../locales";

interface ErrorPageProps {
  /**
   * Set by the catch-all route, where no error is thrown and `useRouteError`
   * would otherwise be empty — without it an unknown URL reads as a crash.
   */
  notFound?: boolean;
}

/**
 * Router-level error boundary. Renders for unmatched paths (404) and for any
 * error thrown by a module loader or element.
 */
export const ErrorPage = ({ notFound = false }: ErrorPageProps) => {
  const error = useRouteError();
  const { t } = useTranslation();

  const isNotFound =
    notFound || (isRouteErrorResponse(error) && error.status === 404);

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
