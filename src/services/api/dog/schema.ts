/* ************************************
 * ------- Dog Payload Schemas --------
 * ************************************/
import { z } from "zod";

/** Request payloads — validated before the call leaves the app. */
export const DogSchemas = {
  breedImage: z.object({
    breed: z.string().min(1, { message: "Breed is required" }),
  }),
};

/**
 * Response shapes — validated after the call returns.
 *
 * dog.ceo wraps every response in `{ message, status }`, so the schemas
 * describe that envelope and the service unwraps it.
 */
export const DogResponseSchemas = {
  /** `message` is an object of breed -> sub-breeds. */
  breedList: z.object({
    message: z.record(z.string(), z.array(z.string())),
    status: z.literal("success"),
  }),

  /** `message` is an image URL. */
  image: z.object({
    message: z.url(),
    status: z.literal("success"),
  }),
};
