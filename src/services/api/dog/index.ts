/* ************************************
 * ---------- Dog Service -------------
 * ************************************/
import { DogResponseSchemas, DogSchemas } from "./schema";
import type { Dog } from "./types";

export { DogSchemas, DogResponseSchemas } from "./schema";
export type { Dog } from "./types";

/**
 * A third-party API, so this resource brings its own base URL and needs no
 * auth at all — nothing is shared with the app's own backend.
 *
 * https://dog.ceo/dog-api/breeds-list
 */
const BASE_URL = "https://dog.ceo/api";

/** GET /breeds/list/all — every breed and its sub-breeds. */
export const listBreeds = async (): Promise<Dog.IBreed[]> => {
  const response = await fetch(`${BASE_URL}/breeds/list/all`);
  if (!response.ok) throw new Error(`Failed to list breeds (${response.status})`);

  // Validation happens here, so components never check the shape.
  const { message } = DogResponseSchemas.breedList.parse(await response.json());

  // The envelope is unwrapped and reshaped, so views get a plain list.
  return Object.entries(message).map(([name, subBreeds]) => ({
    name,
    subBreeds,
  }));
};

/** GET /breed/:breed/images/random — one random photo of that breed. */
export const breedImage = async (payload: { breed: string }): Promise<string> => {
  const { breed } = DogSchemas.breedImage.parse(payload);

  const response = await fetch(`${BASE_URL}/breed/${breed}/images/random`);
  if (!response.ok) throw new Error(`Failed to load image (${response.status})`);

  const { message } = DogResponseSchemas.image.parse(await response.json());
  return message;
};
