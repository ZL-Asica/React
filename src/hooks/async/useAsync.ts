import { useCallback, useEffect, useState } from 'react'

/**
 * useAsync
 *
 * A custom React hook to handle asynchronous functions with state management for loading, error, and result.
 * Useful for API calls or other asynchronous operations.
 *
 * @template T - The type of the result returned by the asynchronous function.
 * @template E - The type of the error (defaults to `Error`).
 * @param {() => Promise<T>} asyncFunction - The asynchronous function to execute.
 * @param {boolean} [immediate] - Whether to execute the function immediately upon hook initialization.
 * @returns {{
 *   execute: () => Promise<void>;
 *   loading: boolean;
 *   error: E | null;
 *   result: T | null;
 * }} An object containing:
 *   - `execute`: A function to trigger the async operation manually.
 *   - `loading`: A boolean indicating whether the async operation is in progress.
 *   - `error`: An error object if the operation fails.
 *   - `result`: The result of the successful async operation.
 *
 * @example
 * ```tsx
 * import { useAsync } from '@zl-asica/react';
 *
 * const fetchData = async () => {
 *   const response = await fetch('https://api.example.com/data');
 *   if (!response.ok) throw new Error('Failed to fetch data');
 *   return response.json();
 * };
 *
 * const MyComponent = () => {
 *   const { execute, loading, error, result } = useAsync(fetchData, true);
 *
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *
 *   return <div>Result: {JSON.stringify(result)}</div>;
 * };
 * ```
 */
export const useAsync = <T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
): {
  execute: () => Promise<void>
  loading: boolean
  error: E | null
  result: T | null
} => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<E | null>(null)
  const [result, setResult] = useState<T | null>(null)

  const execute = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const data = await asyncFunction()
      setResult(data)
    }
    catch (error_) {
      setError(error_ as E)
    }
    finally {
      setLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute().catch((error_) => {
        setError(error_ as E)
        setLoading(false)
      })
    }
  }, [immediate, execute])

  return { execute, loading, error, result }
}
