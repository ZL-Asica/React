/**
 * Here are all string related utils.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/utils` for all utils.
 *
 * @module
 * @example
 * ```tsx
 * import { camelCaseToKebabCase } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const kebabCase = camelCaseToKebabCase('myVariableName');
 *   return <p>{kebabCase}</p>;
 * };
 * ```
 */

export { camelCaseToKebabCase } from './camelCaseToKebabCase'
export { capitalize } from './capitalize'
export { generateUniqueId } from './generateUniqueId'
export { removeSpecialCharacters } from './removeSpecialCharacters'
export { reverseString } from './reverseString'
export { toSnakeCase } from './toSnakeCase'
export { truncate } from './truncate'
export { truncateToNearestWord } from './truncateToNearestWord'
