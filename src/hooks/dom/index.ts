/**
 * Here are all DOM hooks.
 *
 * Use `@zl-asica/react/hooks` for all hooks.
 *
 * @module
 * @example
 * ```tsx
 * import { useIsTop } from '@zl-asica/react/hooks'
 *
 * const App = () => {
 *   const isTop = useIsTop()
 *
 *   return (
 *     <div>{isTop ? 'Top' : 'Not Top'}</div>
 *   )
 * }
 * ```
 */

export { useAdaptiveEffect } from './useAdaptiveEffect'
export { useClickOutside } from './useClickOutside'
export { useEventListener } from './useEventListener'
export { useHideOnScrollDown } from './useHideOnScrollDown'
export { useHover } from './useHover'
export { useIntersectionObserver } from './useIntersectionObserver'
export { useInViewport } from './useInViewport'
export { useIsBottom } from './useIsBottom'
export { useIsTop } from './useIsTop'
export { useKeyPress } from './useKeyPress'
export { useOnlineStatus } from './useOnlineStatus'
export { useScrollPosition } from './useScrollPosition'
export { useWindowSize } from './useWindowSize'
