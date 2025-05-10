/**
 * Chunks an array into smaller arrays of a specified size.
 *
 * If the size is invalid (e.g., non-positive integer), the entire array will be returned as a single chunk.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to divide into chunks.
 * @param {number} size - The size of each chunk. Must be a positive integer.
 * @returns {T[][]} A two-dimensional array where each inner array is a chunk of the specified size.
 *
 * @example
 * ```typescript
 * const data = [1, 2, 3, 4, 5, 6];
 * const chunks = chunkArray(data, 2);
 * console.log(chunks); // [[1, 2], [3, 4], [5, 6]]
 *
 * const invalidChunks = chunkArray(data, -1);
 * console.log(invalidChunks); // [[1, 2, 3, 4, 5, 6]]
 * ```
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  // Handle invalid size by returning the entire array as a single chunk
  if (size <= 0 || !Number.isInteger(size)) {
    return [array]
  }

  const result: T[][] = []
  for (let index = 0; index < array.length; index += size) {
    result.push(array.slice(index, index + size))
  }
  return result
}

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

/**
 * A helper function to check if an number array contains all zeros or empty.
 *
 * This function checks if the input is a valid array (return false), then checks if the array is empty (return true),
 * and finally checks if all elements in the array are numbers and are zero.
 *
 * @param {number[]} array - The array to check.
 * @returns {boolean} `true` if the array is empty or contains only zeros, or `false` otherwise.
 */
export const isAllZeroArray = (array: number[]): boolean => {
  // Check if the input is a valid array
  if (!Array.isArray(array)) {
    return false
  }

  // Check if the array is empty
  if (array.length === 0) {
    return true
  }

  // For loop through to check is number then is zero
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] !== 'number' || Number.isNaN(array[i]) || array[i] !== 0) {
      return false
    }
  }

  return true
}

/**
 * Helper type that, for an object type `T`, merges in an `id: string` property;
 * otherwise wraps a primitive `T` into `{ id: string; value: T }`.
 */
type WithID<T> = T extends object
  ? T & { id: string }
  : { id: string, value: T }

/**
 * Assigns a UUID to each element in the array.
 *
 * - If an object already has a string `id` property, that `id` is preserved.
 * - If an object lacks an `id`, the object is spread and a new `id` is added.
 * - For primitive values, each element is wrapped into `{ id: string; value: T }`.
 *
 * **Note:** When falling back (Next.js server side) to the Math.random–based UUID generator,
 * the IDs are **not** cryptographically secure. This utility is intended for
 * small arrays, loop indexes, UI‑keys, or other non‑critical identifiers.
 * Avoid using it for large volumes of data or any security‑sensitive contexts.
 *
 * @typeParam T
 *   The type of the array elements.
 *
 * @param array
 *   The input array of items to which UUIDs will be assigned.
 *
 * @returns
 *   An array of the same length where each element is either:
 *   - `T & { id: string }` (if `T` is an object),
 *   - or `{ id: string; value: T }` (if `T` is a primitive).
 *
 * @example
 * ```typescript
 * // Objects with and without existing IDs:
 * const objs = [{ id: 'abc', name: 'foo' }, { name: 'bar' }];
 * const withIds = assignUUID(objs);
 * // → [ { id: 'abc', name: 'foo' }, { id: '550e8400-e29b-41d4-a716-446655440000', name: 'bar' } ]
 * ```
 * @example
 * ```typescript
 * // Array of numbers:
 * const nums = [42, 7];
 * const wrappedNums = assignUUID(nums);
 * // → [ { id: '550e8400-e29b-41d4-a716-446655440001', value: 42 },
 * //     { id: '550e8400-e29b-41d4-a716-446655440002', value: 7 } ]
 * ```
 */
export function assignUUID<T extends object>(
  array: T[]
): Array<T & { id: string }>
export function assignUUID<T>(
  array: T[]
): Array<{ id: string, value: T }>

/**
 * Implementation of assignUUID.
 */
export function assignUUID<T>(array: T[]): WithID<T>[] {
  return array.map((item) => {
    // Case 1: object with existing string `id`
    if (
      item !== null
      && typeof item === 'object'
      && 'id' in item
      && typeof item.id === 'string'
    ) {
      return item as WithID<T>
    }

    let id: string
    if (globalThis.crypto !== undefined && globalThis.crypto.randomUUID !== undefined) {
      id = globalThis.crypto.randomUUID()
    }
    else {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    // Case 2: object without `id` → spread in new `id`
    if (item !== null && typeof item === 'object') {
      return { ...(item as object), id } as WithID<T>
    }

    // Case 3: primitive → wrap into `{ id, value }`
    return { id, value: item } as WithID<T>
  })
}
