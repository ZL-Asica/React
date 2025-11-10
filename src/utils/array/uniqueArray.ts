/**
 * Removes duplicate elements from an array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to process.
 * @returns {T[]} A new array with all duplicates removed.
 *
 * @example
 * ```typescript
 * const data = [1, 2, 2, 3, 4, 4, 5];
 * const unique = uniqueArray(data);
 * console.log(unique); // [1, 2, 3, 4, 5]
 * ```
 */
export const uniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}
