import type { RouteObject } from "react-router-dom";
import { Home } from "../views";

/**
 * The home module's public surface. `src/app/router` is the only consumer.
 */
export const homeRoutes: RouteObject[] = [{ index: true, element: <Home /> }];
