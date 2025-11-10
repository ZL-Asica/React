/**
 * Determines whether a value is a non-array object.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if the value is an object, otherwise `false`.
 *
 * @example
 * ```tsx
 * isObject({}); // true
 * isObject(null); // false
 * isObject([]); // false
 * ```
 */
export const isObject = (
  value: unknown = null,
): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
