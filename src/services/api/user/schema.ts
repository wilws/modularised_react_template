/* ************************************
 * ------- User Payload Schemas -------
 * ************************************/
import { z } from "zod";

const validNameRegex = /^[a-zA-Z\s]+$/;

/**
 * Request payloads — validated before the call leaves the app.
 *
 * Each resource declares exactly the fields it needs. There is no shared base
 * payload, so an endpoint that needs no auth simply doesn't ask for any.
 */
export const UserSchemas = {
  viewProfile: z.object({
    userId: z.string().min(1, { message: "User id is required" }),
  }),

  update: z.object({
    userId: z.string().min(1, { message: "User id is required" }),
    givenName: z
      .string()
      .min(1, { message: "Given name is required" })
      .regex(validNameRegex, {
        message: "Given name can only contain letters and spaces",
      })
      .optional(),
    familyName: z
      .string()
      .min(1, { message: "Family name is required" })
      .regex(validNameRegex, {
        message: "Family name can only contain letters and spaces",
      })
      .optional(),
    picture: z.string().nullable().optional(),
  }),
};

/** Response shapes — validated after the call returns. */
export const UserResponseSchemas = {
  profile: z.object({
    id: z.string(),
    email: z.email(),
    givenName: z.string().nullable(),
    familyName: z.string().nullable(),
    picture: z.string().nullable(),
    createdAt: z.iso.datetime(),
  }),

  list: z.array(
    z.object({
      id: z.string(),
      email: z.email(),
      givenName: z.string().nullable(),
      familyName: z.string().nullable(),
    }),
  ),
};
