import type { RouteObject } from "react-router-dom";
import { DocsLayout } from "../../../app/components";
import { servicesDocs } from "../content";
import { DocSection } from "../views";

/** The servicesDocs module's public surface. */
export const servicesDocsRoutes: RouteObject[] = [
  {
    path: "services",
    element: (
      <DocsLayout
        title="services"
        sections={servicesDocs.map(({ slug }) => ({
          to: slug ? `/services/${slug}` : "/services",
          label: slug || "overview",
        }))}
      />
    ),
    children: servicesDocs.map((entry) =>
      entry.slug
        ? { path: entry.slug, element: <DocSection entry={entry} /> }
        : { index: true, element: <DocSection entry={entry} /> },
    ),
  },
];
