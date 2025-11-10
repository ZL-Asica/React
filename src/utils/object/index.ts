/**
 * Here are all object related utils.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/utils` for all utils.
 *
 * @module
 * @example
 * ```tsx
 * import { isEmpty } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const emptyString = isEmpty('');
 *   // emptyString will be true
 *   return <p>{emptyString}</p>;
 * };
 * ```
 */

export { deepClone } from './deepClone'
export { isEmpty } from './isEmpty'
export { isObject } from './isObject'
export { mergeObjects } from './mergeObjects'
export { omit } from './omit'
export { pick } from './pick'
