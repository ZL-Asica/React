import type { DependencyList } from 'react'
import { useEffect } from 'react'

/**
 * Run an async side effect with built-in cancellation on dependency change
 * and unmount. The provided function receives an `AbortSignal` that can be
 * used to cancel in-flight work (for example, fetch requests).
 *
 * This is a small convenience wrapper on top of `useEffect` for
 * "fire-and-forget" async work that should respond to dependency changes.
 * The hook itself does not handle errors; you are expected to catch and
 * handle them inside the provided `effect` callback.
 *
 * On every run:
 * - A new `AbortController` is created and its `signal` is passed to `effect`.
 * - When dependencies change or the component unmounts, the previous
 *   controller is aborted, causing `signal.aborted` to become `true`.
 *
 * @param {(signal: AbortSignal) => Promise<void> | void} effect - The async effect function.
 *   It receives an {@link AbortSignal} that can be passed to APIs which support
 *   cancellation (such as `fetch`).
 * @param {DependencyList} deps - Dependency list, same semantics as `useEffect`.
 *
 * @example
 * ```tsx
 * useAsyncEffect(async (signal) => {
 *   const res = await fetch('/api/data', { signal });
 *   if (!res.ok) {
 *     throw new Error('Failed to fetch')
 *   };
 *   const json = await res.json();
 *   // handle json...
 * }, [id]);
 * ```
 */
export const useAsyncEffect = (
  effect: (signal: AbortSignal) => Promise<void> | void,
  deps: DependencyList,
): void => {
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    // Do not await here; caller handles errors/logging inside `effect`.
    void effect(signal)

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
