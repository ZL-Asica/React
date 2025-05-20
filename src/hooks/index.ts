/**
 * This module contains hooks for asynchronous operations, DOM interactions, and state management. Only works in the browser (client-side).
 *
 * Use `@zl-asica/react/hooks` for hooks in CSR (Client-Side Rendering). `@zl-asica/react` will also works.
 *
 * @module @zl-asica/react/hooks
 * @example
 * ```tsx
 * import { useToggle } from '@zl-asica/react/hooks'
 *
 * const ToggleExample = () => {
 *   const [isToggled, toggle] = useToggle()
 *
 *   return (
 *     <button type="button" onClick={toggle}>{isToggled ? 'ON' : 'OFF'}</button>
 *   )
 * }
 * ```
 */
export * from './async'
export * from './dom'
export * from './state'
