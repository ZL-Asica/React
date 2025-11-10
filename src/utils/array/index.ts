/**
 * Here are all array related utils.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/utils` for all utils.
 *
 * @module
 * @example
 * ```tsx
 * import { assignUUID } from '@zl-asica/react';
 *
 * // Objects with and without existing IDs:
 * const objs = [{ id: 'abc', name: 'foo' }, { name: 'bar' }];
 * const withIds = assignUUID(objs);
 * // → [ { id: 'abc', name: 'foo' }, { id: '550e8400-e29b-41d4-a716-446655440000', name: 'bar' } ]
 * ```
 */

export { assignUUID } from './assignUUID'
export { chunkArray } from './chunkArray'
export { isAllZeroArray } from './isAllZeroArray'
export { uniqueArray } from './uniqueArray'
