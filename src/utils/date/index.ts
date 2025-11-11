/**
 * Here are all date related utils.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/utils` for all utils.
 *
 * @module
 * @example
 * ```tsx
 * import { formatDate } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const formatted = formatDate(new Date(), "YYYY-MM");
 *   // formatted will be something like "2025-11"
 *   return <p>{formatted}</p>;
 * };
 * ```
 */

export { formatDate } from './formatDate'
export { formatDistanceToNow } from './formatDistanceToNow'
export { getDayOfWeek } from './getDayOfWeek'
export { getRelativeDay } from './getRelativeDay'
export { isSameDay } from './isSameDay'
