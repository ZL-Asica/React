import { useCallback, useState } from 'react'

/**
 * A custom React hook for managing a numeric counter state with helper functions.
 * Provides functions to increment, decrement, and reset the counter value.
 *
 * @param {number} [initialValue] - The initial value of the counter. Defaults to `0`.
 * @returns {{
 *   count: number;
 *   increment: () => void;
 *   decrement: () => void;
 *   reset: () => void;
 * }} An object containing:
 *   - `count`: The current value of the counter.
 *   - `increment`: A function to increase the counter by 1.
 *   - `decrement`: A function to decrease the counter by 1.
 *   - `reset`: A function to reset the counter to its initial value.
 *
 * @example
 * ```tsx
 * import { useCounter } from '@zl-asica/react';
 *
 * const CounterComponent = () => {
 *   const { count, increment, decrement, reset } = useCounter(10);
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment}>Increment</button>
 *       <button onClick={decrement}>Decrement</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useCounter = (
  initialValue: number = 0,
): {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
} => {
  const [count, setCount] = useState<number>(initialValue)

  const increment = useCallback(
    () => setCount(previousCount => previousCount + 1),
    [],
  )
  const decrement = useCallback(
    () => setCount(previousCount => previousCount - 1),
    [],
  )
  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return { count, increment, decrement, reset }
}
