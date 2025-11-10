/**
 * Here are all math related utils.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/utils` for all utils.
 *
 * @module
 * @example
 * ```tsx
 * import { clamp } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const clampNumber = clamp(5, 1, 10);
 *   // clampNumber will be 5
 *   return <p>{clampNumber}</p>;
 * };
 * ```
 */

export { clamp } from './clamp'
export { lerp } from './lerp'
export { mapRange } from './mapRange'
export { randomFloat } from './randomFloat'
export { randomInt } from './randomInt'
