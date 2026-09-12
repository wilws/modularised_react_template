/* ************************************
 * ---------- Dog Types ---------------
 * ************************************/
import type { z } from "zod";
import type { DogResponseSchemas } from "./schema";

/* Types are inferred from the schemas, never hand-written, so a schema change
 * is a compile error at every call site. */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Dog {
  /** One breed, flattened from the API's breed -> sub-breeds map. */
  export interface IBreed {
    name: string;
    subBreeds: string[];
  }

  export type IBreedListResponse = z.infer<
    typeof DogResponseSchemas.breedList
  >;
  export type IImageResponse = z.infer<typeof DogResponseSchemas.image>;
}
