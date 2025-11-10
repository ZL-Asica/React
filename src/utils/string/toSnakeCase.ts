/**
 * Converts a string to snake_case.
 *
 * @param {string} input - The string to convert.
 * @returns {string} The snake_case string.
 *
 * @example
 * ```tsx
 * toSnakeCase('camelCaseString'); // 'camel_case_string'
 * toSnakeCase('anotherExample'); // 'another_example'
 * ```
 */
export const toSnakeCase = (input: string): string => {
  return input.replaceAll(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}
