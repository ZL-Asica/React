/**
 * Here are all state hooks.
 *
 * Use `@zl-asica/react` or `@zl-asica/react/hooks` for all hooks.
 *
 * @module
 * @example
 * ```tsx
 * import { useToggle } from '@zl-asica/react/hooks'
 *
 * const App = () => {
 *   const { value, toggle } = useToggle(false)
 *
 *   return (
 *     <button onClick={toggle}>{value ? 'On' : 'Off'}</button>
 *   )
 * }
 * ```
 */

export { useArray } from './useArray'
export { useBoolean } from './useBoolean'
export { useCounter } from './useCounter'
export { useDebounce } from './useDebounce'
export { useDebouncedCallback } from './useDebouncedCallback'
export { useLocalStorage } from './useLocalStorage'
export { useObfuscatedEmail } from './useObfuscatedEmail'
export { useSessionStorage } from './useSessionStorage'
export { useTheme } from './useTheme'
export { useThrottle } from './useThrottle'
export { useTimeout } from './useTimeout'
export { useToggle } from './useToggle'
