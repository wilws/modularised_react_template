/* ************************************
 * ---------- useAsync hook -----------
 * ************************************/
import { useCallback, useState } from "react";

interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  /** Runs the task; never rejects — inspect `error` instead. */
  run: () => Promise<void>;
  reset: () => void;
}

/**
 * Runs an async task and tracks its loading, error and result state.
 *
 * This lives in app/hooks because any module may need it. It deliberately
 * exposes the raw `error` rather than a message, so each caller decides how to
 * present it — a module hook like useBreeds narrows it to a translated string.
 *
 * Pass a stable `task` (a service function, or one wrapped in useCallback),
 * since `run` changes whenever it does.
 */
export const useAsync = <T,>(task: () => Promise<T>): UseAsyncResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await task());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [task]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, reset };
};
