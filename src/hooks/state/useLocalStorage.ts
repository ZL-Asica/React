import { useState } from 'react'

/**
 * A custom React hook for managing state that is synchronized with `localStorage`.
 * Provides error handling by returning a status object along with the value and setter.
 *
 * @param {string} key - The key to store the data under in `localStorage`.
 * @param {T} initialValue - The initial value to use if no data is stored under the key.
 * @returns {{
 *   value: T;
 *   setValue: (value: T | ((currentValue: T) => T)) => void;
 *   error: Error | null;
 * }} An object containing the stored value, setter function, and error state.
 *
 * @example
 * ```tsx
 * import { useLocalStorage } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { value: name, setValue: setName, error } = useLocalStorage<string>('user_name', 'Guest');
 *
 *   if (error) {
 *     return <p>Error: {error.message}</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={name}
 *         onChange={(e) => setName(e.target.value)}
 *       />
 *       <p>Hello, {name}!</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): {
  value: T
  setValue: (value: T | ((currentValue: T) => T)) => void
  error: Error | null
} => {
  const getStoredValue = (key: string, defaultValue: T): [T, Error | null] => {
    try {
      const storedValue = globalThis.localStorage.getItem(key)
      if (storedValue === null || storedValue === undefined) {
        return [defaultValue, null]
      }
      return [JSON.parse(storedValue) as T, null]
    }
    catch (error) {
      return [
        defaultValue,
        error instanceof Error ? error : new Error('Unknown error'),
      ]
    }
  }

  const [storedValue, setStoredValue] = useState<T>(() => {
    const [value] = getStoredValue(key, initialValue)
    return value
  })

  const [error, setError] = useState<Error | null>(() => {
    const [, initialError] = getStoredValue(key, initialValue)
    return initialError
  })

  const setValue = (newValue: T | ((currentValue: T) => T)): void => {
    try {
      const valueToStore
        = typeof newValue === 'function'
          ? (newValue as (currentValue: T) => T)(storedValue)
          : newValue

      // Only update localStorage and state if storage succeeds
      globalThis.localStorage.setItem(key, JSON.stringify(valueToStore))
      setStoredValue(valueToStore)
      setError(null) // Clear any previous errors
    }
    catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }

  return { value: storedValue, setValue, error }
}
