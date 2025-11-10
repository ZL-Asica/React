import type { UseAsyncResult } from './useAsync'
import { useAsync } from './useAsync'
import { usePolling } from './usePolling'

/**
 * A convenience hook that combines {@link useAsync} with {@link usePolling}.
 *
 * It will:
 * - Use `useAsync` to manage `loading`, `error`, and `result` state.
 * - Use `usePolling` to call `execute` on a fixed interval.
 *
 * @template T - The type of the resolved value.
 * @template Args - Tuple of argument types passed to the async function.
 * @template E - The error type (defaults to `Error`).
 *
 * @param {(...args: Args) => Promise<T>} asyncFunction - The async function to execute.
 * @param {number | null} delay - Interval in milliseconds. Set to `null` to stop polling.
 * @param {{ immediate?: boolean }} [options] - Optional configuration.
 *   - `immediate`: Whether to run once immediately when mounted.
 *
 * @returns {UseAsyncResult<T, Args, E>} The same result object as {@link useAsync}.
 *
 * @example
 * ```tsx
 * import { useAsyncPolling } from '@zl-asica/react';
 *
 * const fetchStats = async () => {
 *   const res = await fetch('/api/stats');
 *   if (!res.ok) throw new Error('Failed to fetch stats');
 *   return res.json();
 * };
 *
 * const Stats = () => {
 *   const { result, error, loading } = useAsyncPolling(fetchStats, 5000, {
 *     immediate: true,
 *   });
 *
 *   if (loading && !result) return <p>Loading…</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *
 *   return <pre>{JSON.stringify(result, null, 2)}</pre>;
 * };
 * ```
 */
export const useAsyncPolling = <
  T,
  Args extends unknown[] = [],
  E = Error,
>(
  asyncFunction: (...args: Args) => Promise<T>,
  delay: number | null,
  options?: { immediate?: boolean },
): UseAsyncResult<T, Args, E> => {
  const asyncState = useAsync<T, Args, E>(
    asyncFunction,
    options?.immediate ?? false,
  )

  // Poll the async execute function
  usePolling(asyncState.execute, delay)

  return asyncState
}
