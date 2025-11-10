/**
 * Picks specified keys from an object.
 *
 * @param {T} object - The object to pick properties from.
 * @param {Array<keyof T>} keys - The keys to pick.
 * @returns {Partial<T>} A new object containing only the specified keys.
 *
 * @example
 * ```tsx
 * const obj = { a: 1, b: 2, c: 3 };
 * const picked = pick(obj, ['a', 'c']);
 * console.log(picked); // { a: 1, c: 3 }
 * ```
 */
export const pick = <T extends Record<string, unknown>>(
  object: T,
  keys: Array<keyof T>,
): Partial<T> => {
  const result = {} as Partial<T>
  for (const key of keys) {
    if (key in object) {
      result[key] = object[key]
    }
  }
  return result
}
