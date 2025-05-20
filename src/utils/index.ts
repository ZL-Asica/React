/**
 * This module contains utility functions for arrays, dates, DOM, math, objects, and strings. Compatible with SSR (Server-Side Rendering).
 *
 * Use `@zl-asica/react/utils` for utilities functions in SSR (Server-Side Rendering). If you do not need SSR, use `@zl-asica/react` will also works.
 *
 * @module @zl-asica/react/utils
 * @example
 * ```ts
 * import { assignUUID } from '@zl-asica/react/utils'
 *
 * const data = [
 *   { id: '1', name: 'John' },
 *   { id: '2', name: 'Jane' },
 * ]
 *
 * const dataWithUUID = assignUUID(data)
 *
 * // → [ { id: '1', name: 'John' }, { id: '2', name: 'Jane' } ]
 * ```
 */
export * from './arrayUtils'
export * from './dateUtils'
export * from './domUtils'
export * from './mathUtils'
export * from './objectUtils'
export * from './stringUtils'
