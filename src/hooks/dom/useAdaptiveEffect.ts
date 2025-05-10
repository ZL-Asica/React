import { useEffect, useLayoutEffect } from 'react'

/**
 * A hook that adapts to the environment: uses `useLayoutEffect` on the client side
 * and `useEffect` on the server side. This ensures compatibility with both SSR
 * and CSR environments.
 *
 * Inspired by the implementation from usehooks-ts.
 *
 * @see {@link https://github.com/juliencrn/usehooks-ts} Original implementation
 * @see {@link https://react.dev/reference/react/useEffect} React useEffect documentation
 * @see {@link https://react.dev/reference/react/useLayoutEffect} React useLayoutEffect documentation
 *
 * @example
 * Just like `useEffect`, but it chooses the right hook depending on the environment.
 * ```tsx
 * useAdaptiveEffect(() => {
 *  // Your effect code here
 * }, [dependencies]);
 * ```
 */
export const useAdaptiveEffect
  = typeof globalThis === 'undefined' ? useEffect : useLayoutEffect
