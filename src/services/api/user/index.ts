/* ************************************
 * ---------- User Service ------------
 * ************************************/
import { UserResponseSchemas, UserSchemas } from "./schema";

export { UserSchemas, UserResponseSchemas } from "./schema";
export type { User } from "./types";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "/api";

/** GET /v1/users */
export const listUsers = async () => {
  const response = await fetch(`${BASE_URL}/v1/users`);
  if (!response.ok) throw new Error(`Failed to list users (${response.status})`);

  // Validation happens here, so components never check the shape.
  return UserResponseSchemas.list.parse(await response.json());
};

/** GET /v1/users/:userId */
export const viewProfile = async (payload: { userId: string }) => {
  const { userId } = UserSchemas.viewProfile.parse(payload);

  const response = await fetch(`${BASE_URL}/v1/users/${userId}`);
  if (!response.ok) throw new Error(`Failed to load profile (${response.status})`);

  return UserResponseSchemas.profile.parse(await response.json());
};

/** PATCH /v1/users/:userId */
export const updateProfile = async (payload: {
  userId: string;
  givenName?: string;
  familyName?: string;
  picture?: string | null;
}) => {
  const { userId, ...body } = UserSchemas.update.parse(payload);

  const response = await fetch(`${BASE_URL}/v1/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Failed to update profile (${response.status})`);

  return UserResponseSchemas.profile.parse(await response.json());
};
