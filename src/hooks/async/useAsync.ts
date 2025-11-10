import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Result object returned by {@link useAsync}.
 *
 * @template T - The type of the resolved value.
 * @template Args - Tuple of argument types passed to the async function.
 * @template E - The error type (defaults to `Error`).
 */
export interface UseAsyncResult<T, Args extends unknown[], E> {
  /**
   * Execute the async function. Any arguments provided here will be
   * forwarded to the original `asyncFunction`.
   *
   * @param {...Args} args - Arguments passed to the async function.
   * @returns {Promise<void>} A promise that resolves when the async function completes.
   */
  execute: (...args: Args) => Promise<void>
  /**
   * Whether the async operation is currently in progress.
   */
  loading: boolean
  /**
   * The last error thrown by the async function, if any.
   */
  error: E | null
  /**
   * The last successful result produced by the async function, if any.
   */
  result: T | null
}

/**
 * A React hook to run an async function with managed `loading`, `error`,
 * and `result` state. Useful for data fetching or any asynchronous work.
 *
 * It also:
 * - Ignores results from outdated calls when multiple requests are in flight.
 * - Avoids updating state after the component has unmounted.
 *
 * @template T - The type of the resolved value.
 * @template Args - Tuple of argument types passed to the async function.
 * @template E - The error type (defaults to `Error`).
 *
 * @param {(...args: Args) => Promise<T>} asyncFunction - The async function to execute.
 * @param {boolean} [immediate] - Whether to run once automatically on mount.
 *   Only use `true` when `asyncFunction` does not require arguments.
 *
 * @returns {UseAsyncResult<T, Args, E>} An object with:
 *   - `execute(...args)`: trigger the async function.
 *   - `loading`: whether the async operation is in progress.
 *   - `error`: the last error (if any).
 *   - `result`: the last successful result.
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
export const useAsync = <T, Args extends unknown[] = [], E = Error>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate: boolean = true,
): UseAsyncResult<T, Args, E> => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<E | null>(null)
  const [result, setResult] = useState<T | null>(null)

  const mountedRef = useRef(true)
  const lastCallId = useRef(0)

  // Track mounted/unmounted to avoid setting state after unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (...args: Args): Promise<void> => {
      const callId = ++lastCallId.current

      setLoading(true)
      setError(null)

      try {
        const data = await asyncFunction(...args)

        if (!mountedRef.current || callId !== lastCallId.current) {
          return
        }

        setResult(data)
      }
      catch (error_) {
        if (!mountedRef.current || callId !== lastCallId.current) {
          return
        }

        setError(error_ as E)
      }
      finally {
        if (mountedRef.current && callId === lastCallId.current) {
          setLoading(false)
        }
      }
    },
    [asyncFunction],
  )

  // Run once on mount when `immediate` is true
  useEffect(() => {
    if (!immediate) {
      return
    }

    void execute(...([] as unknown as Args))
  }, [immediate, execute])

  return { execute, loading, error, result }
}
