/**
 * Converts a camelCase string to kebab-case.
 *
 * @param {string} input - The camelCase string.
 * @returns {string} The kebab-case string.
 *
 * @example
 * ```tsx
 * camelCaseToKebabCase('camelCaseString'); // 'camel-case-string'
 * camelCaseToKebabCase('anotherExample'); // 'another-example'
 * ```
 */
export const camelCaseToKebabCase = (input: string): string => {
  return input.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
