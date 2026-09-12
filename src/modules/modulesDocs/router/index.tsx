import type { RouteObject } from "react-router-dom";
import { DocsLayout } from "../../../app/components";
import { modulesDocs } from "../content";
import { DocSection } from "../views";

/** The modulesDocs module's public surface. */
export const modulesDocsRoutes: RouteObject[] = [
  {
    path: "modules",
    element: (
      <DocsLayout
        title="modules"
        sections={modulesDocs.map(({ slug }) => ({
          to: slug ? `/modules/${slug}` : "/modules",
          label: slug || "overview",
        }))}
      />
    ),
    children: modulesDocs.map((entry) =>
      entry.slug
        ? { path: entry.slug, element: <DocSection entry={entry} /> }
        : { index: true, element: <DocSection entry={entry} /> },
    ),
  },
];
