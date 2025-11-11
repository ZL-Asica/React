import { useEffect, useLayoutEffect } from 'react'

/**
 * Resolve which effect hook should be used based on whether a DOM
 * environment is available.
 *
 * @internal
 */
export const __INTERNAL__resolveAdaptiveEffect = (
  hasDOM: boolean,
): typeof useEffect => (hasDOM ? useLayoutEffect : useEffect)

/**
 * A hook that adapts to the environment: uses `useLayoutEffect` on the client side
 * (when a DOM is available) and `useEffect` on the server side. This helps avoid
 * React warnings such as "useLayoutEffect does nothing on the server".
 *
 * @see {@link https://react.dev/reference/react/useEffect} React useEffect documentation
 * @see {@link https://react.dev/reference/react/useLayoutEffect} React useLayoutEffect documentation
 *
 * @example
 * Just like `useEffect`, but it chooses the right hook depending on the environment.
 * ```tsx
 * useAdaptiveEffect(() => {
 *   // Your effect code here
 * }, [dependencies]);
 * ```
 */
export const useAdaptiveEffect: typeof useEffect
  = __INTERNAL__resolveAdaptiveEffect(
    // "Has DOM" check: window + document must both exist
    typeof window !== 'undefined' && typeof document !== 'undefined',
  )
