import { useEffect, useState } from 'react'

/**
 * A React hook that debounces a value.
 *
 * It delays updating the returned value until after the specified delay
 * has elapsed since the last time the input `value` changed.
 *
 * Commonly used for search inputs, filters, or any value that should
 * not update on every keystroke but only after the user pauses typing.
 *
 * @param {T} value - The value to debounce. Can be any type.
 * @param {number} [delay] - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * ```tsx
 * import { useState, useEffect } from 'react';
 * import { useDebounce } from '@zl-asica/react/hooks';
 *
 * const Search = () => {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 *
 *   useEffect(() => {
 *     if (!debouncedQuery) return;
 *     // Fire the search request with `debouncedQuery`
 *   }, [debouncedQuery]);
 *
 *   return (
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * };
 * ```
 */
export const useDebounce = <T>(value: T, delay: number = 200): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}
