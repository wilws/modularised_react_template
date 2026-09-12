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
          // "components/basic" renders as an indented "basic" under "components"
          label: slug ? (slug.split("/")[1] ?? slug) : "overview",
          nested: slug.includes("/"),
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
