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

export * from './camelCaseToKebabCase'
export * from './capitalize'
export * from './escapeRegExp'
export * from './generateUniqueId'
export * from './isBlank'
export * from './normalizeWhitespace'
export * from './removeSpecialCharacters'
export * from './reverseString'
export * from './slugify'
export * from './splitWords'
export * from './toSnakeCase'
export * from './toTitleCase'
export * from './truncate'
export * from './truncateMiddle'
export * from './truncateToNearestWord'
