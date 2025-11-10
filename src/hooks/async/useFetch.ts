import { useCallback } from 'react'
import { useAsync } from './useAsync'

/**
 * A React hook to fetch JSON data from a URL and manage its `loading`, `error`,
 * and `data` state. It is built on top of {@link useAsync} and will:
 *
 * - Fetch once on mount.
 * - Refetch whenever the `url` changes.
 * - Ignore results from outdated requests when multiple fetches are in flight.
 * - Avoid updating state after the component has unmounted.
 *
 * @template T - The type of the JSON payload returned by the API.
 *
 * @param {string} url - The URL to fetch from.
 *
 * @returns {{
 *   data: T | null;
 *   error: Error | null;
 *   loading: boolean;
 * }} An object containing:
 *   - `data`: The parsed JSON response, or `null` if not yet loaded or on error.
 *   - `error`: An `Error` instance if the fetch failed.
 *   - `loading`: Whether a fetch request is currently in progress.
 *
 * @example
 * ```tsx
 * import { useFetch } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { data, error, loading } = useFetch<{ message: string }>(
 *     'https://api.example.com/endpoint'
 *   );
 *
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *
 *   return <p>Data: {data?.message}</p>;
 * };
 * ```
 */
export const useFetch = <T>(
  url: string,
): {
  data: T | null
  error: Error | null
  loading: boolean
} => {
  const fetcher = useCallback(async (): Promise<T> => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(response.statusText || 'Fetch failed')
    }

    const result = (await response.json()) as T
    return result
  }, [url])

  // We want to normalize any kind of error back to `Error`.
  const {
    result,
    error: rawError,
    loading,
  } = useAsync<T, [], unknown>(fetcher, true)

  const normalizedError
    = rawError instanceof Error
      ? rawError
      : rawError == null
        ? null
        : new Error('Unknown error')

  return {
    data: result,
    error: normalizedError,
    loading,
  }
}
