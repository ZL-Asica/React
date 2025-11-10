/**
 * Creates a deep clone of an object using `structuredClone`.
 *
 * @param {T} object - The object to deeply clone.
 * @returns {T} A deep clone of the object.
 *
 * @example
 * ```tsx
 * const original = { a: 1, b: { c: 2 } };
 * const clone = deepClone(original);
 * clone.b.c = 3;
 * console.log(original.b.c); // 2
 * ```
 */
export const deepClone = <T>(object: T): T => {
  return structuredClone(object)
}
