import type { RouteObject } from "react-router-dom";
import { DocsLayout } from "../../../app/components";
import { appDocs } from "../content";
import { DocSection } from "../views";

/**
 * The appDocs module's public surface. `src/app/router` is the only consumer.
 *
 * The sidebar sections and the child routes are generated from the same
 * content array, so they can never fall out of sync.
 */
export const appDocsRoutes: RouteObject[] = [
  {
    path: "app",
    element: (
      <DocsLayout
        title="app"
        sections={appDocs.map(({ slug }) => ({
          to: slug ? `/app/${slug}` : "/app",
          label: slug || "overview",
        }))}
      />
    ),
    children: appDocs.map(({ slug, ...entry }) =>
      slug
        ? { path: slug, element: <DocSection entry={{ slug, ...entry }} /> }
        : { index: true, element: <DocSection entry={{ slug, ...entry }} /> },
    ),
  },
];
