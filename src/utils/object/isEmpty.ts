import { isObject } from './isObject'

/**
 * Checks if a value is an empty object, array, string, or falsy value.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if the value is empty or falsy, otherwise `false`.
 *
 * @example
 * ```tsx
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty(''); // true
 * isEmpty(null); // true
 * isEmpty(0); // false
 * isEmpty(true); // false
 * ```
 */
export const isEmpty = (value: unknown): boolean => {
  // Covers `null` and `undefined`
  if (value === null) {
    return true
  }
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0
  }
  return false // Non-empty, non-object, and non-nullish types
}
