import { useEffect, useState } from 'react'

/**
 * useFetch
 *
 * A custom React hook to fetch data from an API and manage its state.
 * Automatically handles loading, error, and result states.
 * Supports cancellation of the fetch operation on component unmount.
 *
 * @template T - The type of the data to fetch.
 * @param {string} url - The API endpoint to fetch data from.
 * @returns {{
 *   data: T | null;
 *   error: Error | null;
 *   loading: boolean;
 * }} An object containing:
 *   - `data`: The fetched data or null if not available.
 *   - `error`: An error object if the fetch operation fails.
 *   - `loading`: A boolean indicating whether the fetch operation is in progress.
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
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let isCancelled = false

    const fetchData = async (): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(response.statusText || 'Fetch failed')
        }
        const result: T = (await response.json()) as T
        if (!isCancelled) {
          setData(result)
        }
      }
      catch (fetchError) {
        if (!isCancelled) {
          setError(
            fetchError instanceof Error ? fetchError : new Error('Unknown error'),
          )
          setData(null)
        }
      }
      finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchData().catch((error) => {
      if (!isCancelled) {
        setError(error instanceof Error ? error : new Error('Unknown error'))
        setLoading(false)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [url])

  return { data, error, loading }
}
