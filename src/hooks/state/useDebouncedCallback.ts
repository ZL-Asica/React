import { useCallback, useEffect, useRef } from 'react'

/**
 * A React hook that returns a debounced version of a callback.
 * The debounced function will postpone its execution until after
 * the specified delay has elapsed since the last time it was invoked.
 *
 * The debounced function identity is stable across re-renders
 * (unless the `delay` changes), and always calls the latest `callback`.
 *
 * @template TArguments - The argument types for the callback function.
 * @param {(...args: TArguments) => void} callback - The original callback function to debounce.
 * @param {number} [delay] - Default 200ms. The debounce delay in milliseconds.
 * @returns {(...args: TArguments) => void} A debounced version of the callback function.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { useDebouncedCallback } from '@zl-asica/react/hooks';
 *
 * const MyComponent = () => {
 *   const [query, setQuery] = useState('');
 *   const debouncedSearch = useDebouncedCallback((searchQuery: string) => {
 *     console.log('Searching for:', searchQuery);
 *   }, 300);
 *
 *   return (
 *     <input
 *       type="text"
 *       value={query}
 *       onChange={(e) => {
 *         setQuery(e.target.value);
 *         debouncedSearch(e.target.value);
 *       }}
 *       placeholder="Search..."
 *     />
 *   );
 * };
 * ```
 */
export const useDebouncedCallback = <TArguments extends unknown[]>(
  callback: (...arguments_: TArguments) => void,
  delay: number = 200,
): ((...arguments_: TArguments) => void) => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the ref in sync with the latest callback
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const debouncedCallback = useCallback(
    (...arguments_: TArguments) => {
      // Clear any pending timeout before scheduling a new one
      clearTimeoutRef()

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...arguments_)
        // Clear after executing to avoid dangling references
        timeoutRef.current = null
      }, delay)
    },
    [delay, clearTimeoutRef],
  )

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      clearTimeoutRef()
    },
    [clearTimeoutRef],
  )

  return debouncedCallback
}
