import { useCallback, useRef } from 'react'

/**
 * A custom React hook to throttle the execution of a callback function.
 * Ensures the callback is only executed at most once every specified delay.
 *
 * @template TArgs - The argument types for the callback function.
 * @param {(...args: TArgs) => void} callback - The function to throttle.
 * @param {number} delay - The delay in milliseconds between allowed executions of the callback.
 * @returns {(...args: TArgs) => void} The throttled function.
 *
 * @example
 * ```tsx
 * import { useThrottle } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const handleClick = useThrottle(() => {
 *     console.log('Button clicked!');
 *   }, 1000);
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * };
 * ```
 */
export const useThrottle = <TArguments extends unknown[]>(
  callback: (...arguments_: TArguments) => void,
  delay: number,
): ((...arguments_: TArguments) => void) => {
  const lastExecutedReference = useRef<number | null>(null)

  const throttledCallback = useCallback(
    (...arguments_: TArguments) => {
      const now = Date.now()
      if (
        lastExecutedReference.current === null
        || now - lastExecutedReference.current >= delay
      ) {
        callback(...arguments_)
        lastExecutedReference.current = now
      }
    },
    [callback, delay],
  )

  return throttledCallback
}
