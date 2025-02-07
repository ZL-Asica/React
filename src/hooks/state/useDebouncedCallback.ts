'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * useDebouncedCallback
 *
 * A custom React hook to debounce a callback function. The debounced function will only be executed
 * after a specified period of inactivity.
 *
 * @template TArguments - The argument types for the callback function.
 * @param {(args: TArguments) => void} callback - The original callback function to debounce.
 * @param {number} [delay] - The debounce delay in milliseconds. Defaults to 200ms.
 * @returns {(args: TArguments) => void} A debounced version of the callback function.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { useDebouncedCallback } from '@zl-asica/react';
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
  const callbackReference = useRef(callback)
  const timeoutReference = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Always update the ref to the latest callback
    callbackReference.current = callback
  }, [callback])

  const debouncedCallback = useCallback(
    (...arguments_: TArguments) => {
      // Clear the existing timeout
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current)
      }

      // Set a new timeout
      timeoutReference.current = setTimeout(() => {
        callbackReference.current(...arguments_)
      }, delay)
    },
    [delay],
  )

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current)
      }
    }
  }, [])

  return debouncedCallback
}
