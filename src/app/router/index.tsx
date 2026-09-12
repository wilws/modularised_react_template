import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ErrorPage, MainLayout } from "../components";
import { homeRoutes } from "../../modules/home/router";

/**
 * The one place modules plug into the app.
 *
 * Every module exports a `RouteObject[]` from its `router/index.tsx` and is
 * registered here. Nothing else in `src/app` imports from `src/modules`, and
 * modules never import each other — navigate by path instead.
 */
const moduleRoutes: RouteObject[] = [
  ...homeRoutes,
  // ...aboutRoutes,
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...moduleRoutes,
      // Catch-all: anything unmatched renders inside the shell.
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

export default router;
