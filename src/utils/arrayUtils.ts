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
