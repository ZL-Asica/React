/**
 * This module contains hooks and utilities for React. Use specific `utils` for SSR (Server-Side Rendering).
 * @module @zl-asica/react
 * @example
 * ```tsx
 * import { useToggle } from '@zl-asica/react/hooks'
 * import { assignUUID } from '@zl-asica/react/utils'
 *
 * const ToggleExample = () => {
 *   const [isToggled, toggle] = useToggle()
 *
 *   return (
 *     <button type="button" onClick={toggle}>{isToggled ? 'ON' : 'OFF'}</button>
 *   )
 * }
 *
 * const AssignUUIDExample = () => {
 *   const data = assignUUID([{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }])
 *
 *   return (
 *     data.map(item =>
 *       <p key={item.id}>
 *         {item.id}
 *         {item.name}
 *       </p>
 *     )
 *   )
 * }
 * ```
 */
export * from './hooks'
export * from './utils'
