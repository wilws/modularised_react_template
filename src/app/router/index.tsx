import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ErrorPage, MainLayout } from "../components";
import { homeRoutes } from "../../modules/home/router";
import { appDocsRoutes } from "../../modules/appDocs/router";
import { modulesDocsRoutes } from "../../modules/modulesDocs/router";
import { servicesDocsRoutes } from "../../modules/servicesDocs/router";

/**
 * The one place modules plug into the app.
 *
 * Every module exports a `RouteObject[]` from its `router/index.tsx` and is
 * registered here. Nothing else in `src/app` imports from `src/modules`, and
 * modules never import each other — navigate by path instead.
 */
const moduleRoutes: RouteObject[] = [
  ...homeRoutes,
  ...appDocsRoutes,
  ...modulesDocsRoutes,
  ...servicesDocsRoutes,
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...moduleRoutes,
      // Catch-all: anything unmatched renders inside the shell.
      { path: "*", element: <ErrorPage notFound /> },
    ],
  },
]);

export default router;
