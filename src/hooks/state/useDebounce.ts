import { useEffect, useState } from 'react'

/**
 * useDebounce
 *
 * A custom React hook to debounce a value or multiple values. It delays updating the state until
 * after a specified period of inactivity. Useful for improving performance in scenarios like
 * search input handling or API calls.
 *
 * @param {T} value - The value to debounce. Can be any type (e.g., primitive, object, array, function).
 * @param {number} [delay] - The debounce delay in milliseconds. Defaults to 200ms.
 * @returns {T} The debounced value, which updates after the specified delay.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { useDebounce } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const [text, setText] = useState('');
 *   const debouncedText = useDebounce(text, 300);
 *
 *   useEffect(() => {
 *     if (debouncedText) {
 *       console.log('Debounced text:', debouncedText);
 *     }
 *   }, [debouncedText]);
 *
 *   return (
 *     <input
 *       type="text"
 *       value={text}
 *       onChange={(e) => setText(e.target.value)}
 *       placeholder="Type something..."
 *     />
 *   );
 * };
 * ```
 * @example
 * ```tsx
 * import { useCallback } from 'react';
 * import { useDebounce } from './useDebounce';
 *
 * const MyComponent = () => {
 *   const handleSearch = (query: string) => {
 *     console.log('Search query:', query);
 *   };
 *
 *   const debouncedSearch = useDebounce(
 *     useCallback((query: string) => handleSearch(query), [handleSearch]),
 *     300
 *   );
 *
 *   return (
 *     <input
 *       type="text"
 *       onChange={(e) => debouncedSearch(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * };
 * ```
 */
export const useDebounce = <T>(value: T, delay: number = 200): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
