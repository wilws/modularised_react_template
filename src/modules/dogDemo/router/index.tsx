import type { RouteObject } from "react-router-dom";
import { DogDemo } from "../views";

/**
 * The dogDemo module's public surface. `src/app/router` is the only consumer.
 */
export const dogDemoRoutes: RouteObject[] = [
  { path: "demo", element: <DogDemo /> },
];
