/* ************************************
 * ------------- API ------------------
 * ************************************/
import * as dogs from "./dog";
import * as users from "./user";

/**
 * Every API resource, grouped by name.
 *
 * Components call `api.users.viewProfile(...)` — one folder per resource,
 * added here as a single line.
 */
export const api = {
  users,
  dogs,
};

export type { User } from "./user";
export type { Dog } from "./dog";
