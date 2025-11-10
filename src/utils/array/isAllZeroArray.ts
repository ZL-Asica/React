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
