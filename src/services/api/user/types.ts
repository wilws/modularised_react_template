/* ************************************
 * ---------- User Types --------------
 * ************************************/
import type { z } from "zod";
import type { UserResponseSchemas, UserSchemas } from "./schema";

/* Types are inferred from the schemas, never hand-written, so a schema change
 * is a compile error at every call site. */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace User {
  export type IViewProfilePayload = z.infer<typeof UserSchemas.viewProfile>;
  export type IUpdateProfilePayload = z.infer<typeof UserSchemas.update>;
  export type IProfile = z.infer<typeof UserResponseSchemas.profile>;
  export type IListItem = z.infer<typeof UserResponseSchemas.list>[number];
}
