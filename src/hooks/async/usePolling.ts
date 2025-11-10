import { useEffect, useRef } from 'react'

/**
 * Callback type for {@link usePolling}. It can be either synchronous
 * or asynchronous. If it returns a Promise, it will be fired-and-forgotten.
 */
export type PollingCallback = () => void | Promise<void>

/**
 * A React hook that executes a callback on a fixed interval.
 * The callback can be updated over time, and polling can be stopped
 * at any time by setting `delay` to `null`.
 *
 * @param {PollingCallback} callback - The function to call on each interval tick.
 * @param {number | null} delay - Interval in milliseconds. Set to `null` to stop polling.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { usePolling } from '@zl-asica/react';
 *
 * const PollingExample = () => {
 *   const [count, setCount] = useState(0);
 *
 *   usePolling(() => {
 *     setCount((prev) => prev + 1);
 *   }, 1000); // Poll every 1 second
 *
 *   return <p>Polling count: {count}</p>;
 * };
 * ```
 */
export const usePolling = (
  callback: PollingCallback,
  delay: number | null,
): void => {
  const savedCallback = useRef<PollingCallback>(callback)

  // Always keep the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setInterval(() => {
      void savedCallback.current()
    }, delay)

    return () => clearInterval(id)
  }, [delay])
}
