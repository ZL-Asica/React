/**
 * Here are all DOM related utils.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/utils` for all utils.
 *
 * @module
 * @example
 * ```tsx
 * import { copyToClipboard } from '@zl-asica/react';
 *
 * const success = await copyToClipboard('Hello, world!');
 * console.log(success ? 'Copied!' : 'Failed to copy!');
 * ```
 */

export { backToTop } from './backToTop'
export { copyToClipboard } from './copyToClipboard'
export { getScrollPosition } from './getScrollPosition'
export { pasteFromClipboard } from './pasteFromClipboard'
