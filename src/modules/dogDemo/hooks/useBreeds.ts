/* ************************************
 * --------- useBreeds hook -----------
 * ************************************/
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { useAsync } from "../../../app/hooks";
import { api, type Dog } from "../../../services/api";

interface BreedData {
  breeds: Dog.IBreed[];
  photo: string;
}

interface UseBreedsResult {
  breeds: Dog.IBreed[];
  photo: string | null;
  loading: boolean;
  /** Already-translated message, or null when there is nothing to show. */
  error: string | null;
  load: () => Promise<void>;
}

/**
 * A hook private to the dogDemo module. It builds on the app-wide `useAsync`
 * for the loading/error plumbing, and adds the part only this feature needs:
 * which calls to make, and how to describe a failure.
 *
 * It lives here rather than in app/hooks because nothing else will ever want
 * it — the generic half is the one that got promoted.
 *
 * @param schemaErrorMessage shown when the API returns an unexpected shape —
 * passed in so this hook stays free of translation concerns.
 */
export const useBreeds = (schemaErrorMessage: string): UseBreedsResult => {
  const task = useCallback(async (): Promise<BreedData> => {
    // No URL, no envelope, no validation — the service already did all three.
    const [breeds, photo] = await Promise.all([
      api.dogs.listBreeds(),
      api.dogs.breedImage({ breed: "hound" }),
    ]);
    return { breeds, photo };
  }, []);

  const { data, loading, error, run } = useAsync(task);

  // The raw error becomes a message the view can render directly.
  const message = useMemo(() => {
    if (error === null) return null;

    if (error instanceof z.ZodError) {
      // The API's shape changed — a different problem from a 500.
      console.error("schema mismatch", z.prettifyError(error));
      return schemaErrorMessage;
    }
    return error instanceof Error ? error.message : String(error);
  }, [error, schemaErrorMessage]);

  return {
    breeds: data?.breeds ?? [],
    photo: data?.photo ?? null,
    loading,
    error: message,
    load: run,
  };
};
