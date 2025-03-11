import { useEffect, useRef } from 'react'

/**
 * A custom React hook to execute a callback function at a fixed interval.
 * Supports dynamically updating the callback or stopping the polling by setting the delay to `null`.
 *
 * @param {() => void} callback - The function to execute at each interval.
 * @param {number | null} delay - The interval in milliseconds. Set to `null` to stop polling.
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
  callback: () => void,
  delay: number | null,
): void => {
  const savedCallback = useRef<() => void>(callback)

  // Update the saved callback whenever it changes
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    // Stop polling if delay is null
    if (delay === null) {
      return
    }

    // Create the interval
    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    // Clear the interval on cleanup
    return () => clearInterval(id)
  }, [delay])
}
