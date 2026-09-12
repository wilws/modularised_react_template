/* ************************************
 * -------- Demo code samples ---------
 * ************************************/

export const structureSample = `src/
├── services/api/dog/          ← the service
│   ├── index.ts                 the fetch calls
│   ├── index.test.ts            its tests
│   ├── schema.ts                zod request + response schemas
│   └── types.ts                 types inferred from the schemas
└── modules/dogDemo/           ← the module
    ├── router/index.tsx         the module's ONLY public surface
    ├── views/DogDemo/           the page — rendering only
    ├── hooks/useBreeds.ts       the state behind the button
    ├── components/BreedList/    private to this module
    ├── content/index.ts         these code samples
    └── locales/index.ts         its strings, in 8 languages`;

export const schemaSample = `/* src/services/api/dog/schema.ts */
import { z } from "zod";

export const DogSchemas = {
  breedImage: z.object({
    breed: z.string().min(1, { message: "Breed is required" }),
  }),
};

// dog.ceo wraps every response in { message, status }
export const DogResponseSchemas = {
  breedList: z.object({
    message: z.record(z.string(), z.array(z.string())),
    status: z.literal("success"),
  }),
  image: z.object({
    message: z.url(),
    status: z.literal("success"),
  }),
};`;

export const serviceSample = `/* src/services/api/dog/index.ts */

// A third-party API brings its own base URL and needs no auth.
const BASE_URL = "https://dog.ceo/api";

export const listBreeds = async (): Promise<Dog.IBreed[]> => {
  const response = await fetch(\`\${BASE_URL}/breeds/list/all\`);
  if (!response.ok) throw new Error(\`Failed (\${response.status})\`);

  // Validated here, so components never check the shape.
  const { message } = DogResponseSchemas.breedList.parse(
    await response.json(),
  );

  // The envelope is unwrapped; views get a plain list.
  return Object.entries(message).map(([name, subBreeds]) => ({
    name,
    subBreeds,
  }));
};

export const breedImage = async (payload: { breed: string }) => {
  const { breed } = DogSchemas.breedImage.parse(payload);   // request validated

  const response = await fetch(\`\${BASE_URL}/breed/\${breed}/images/random\`);
  if (!response.ok) throw new Error(\`Failed (\${response.status})\`);

  const { message } = DogResponseSchemas.image.parse(await response.json());
  return message;
};`;

export const registerSample = `/* src/services/api/index.ts */
import * as dogs from "./dog";
import * as users from "./user";

export const api = {
  users,
  dogs,      // ← now api.dogs.listBreeds()
};`;

export const hookSample = `/* src/modules/dogDemo/hooks/useBreeds.ts */
import { useCallback, useState } from "react";
import { z } from "zod";
import { api, type Dog } from "../../../services/api";

/**
 * Private to this module: it owns the loading, error and result state so the
 * view is left with nothing but rendering.
 */
export const useBreeds = (schemaErrorMessage: string) => {
  const [breeds, setBreeds] = useState<Dog.IBreed[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // No URL, no envelope, no validation — the service did all three.
      const [list, image] = await Promise.all([
        api.dogs.listBreeds(),
        api.dogs.breedImage({ breed: "hound" }),
      ]);
      setBreeds(list);
      setPhoto(image);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // The API's shape changed — a different problem from a 500.
        console.error("schema mismatch", z.prettifyError(err));
        setError(schemaErrorMessage);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, [schemaErrorMessage]);

  return { breeds, photo, loading, error, load };
};`;

export const viewSample = `/* src/modules/dogDemo/views/DogDemo/index.tsx */
import { useModuleTranslation } from "../../../../app/locales";
import { BreedList } from "../../components/BreedList";
import { useBreeds } from "../../hooks";
import { dogLocale } from "../../locales";

export const DogDemo = () => {
  const { t } = useModuleTranslation(dogLocale);

  // One line. No useState, no try/catch, no api import.
  const { breeds, photo, loading, error, load } = useBreeds(
    t("dog.error.schema"),
  );

  return (
    <Stack gap="xl">
      <Button onClick={load} loading={loading}>
        {loading ? t("dog.loading") : t("dog.button")}
      </Button>

      {error && <Alert color="red">{error}</Alert>}
      {photo && <Image src={photo} w={200} radius="md" />}
      {breeds.length > 0 && <BreedList breeds={breeds} />}
    </Stack>
  );
};`;

export const routerSample = `/* src/modules/dogDemo/router/index.tsx */
import type { RouteObject } from "react-router-dom";
import { DogDemo } from "../views";

// The module's entire public surface.
export const dogDemoRoutes: RouteObject[] = [
  { path: "demo", element: <DogDemo /> },
];

/* then one line in src/app/router/index.tsx: */
const moduleRoutes = [...homeRoutes, ...dogDemoRoutes];`;

export const flowSample = `Button onClick
   │
   ▼
useBreeds().load()               modules/dogDemo/hooks/useBreeds.ts
   │
   ▼
api.dogs.listBreeds()            src/services/api/dog/index.ts
   │
   ├─ fetch https://dog.ceo/api/breeds/list/all
   ├─ DogResponseSchemas.breedList.parse(json)   ← validation
   └─ unwrap { message } → Dog.IBreed[]
   │
   ▼
setBreeds(...)                   the view only renders`;
