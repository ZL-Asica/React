/**
 * Omits specified keys from an object.
 *
 * @param {T} object - The object to omit properties from.
 * @param {Array<keyof T>} keys - The keys to omit.
 * @returns {Partial<T>} A new object excluding the specified keys.
 *
 * @example
 * ```tsx
 * const obj = { a: 1, b: 2, c: 3 };
 * const omitted = omit(obj, ['b']);
 * console.log(omitted); // { a: 1, c: 3 }
 * ```
 */
export const omit = <T extends Record<string, unknown>>(
  object: T,
  keys: Array<keyof T>,
): Partial<T> => {
  const result = { ...object }
  for (const key of keys) {
    delete result[key]
  }
  return result
}
