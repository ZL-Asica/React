import { useCallback, useState } from 'react'

/**
 * A custom React hook for managing a boolean state with helper functions.
 * Provides functions to toggle the value, set it to `true`, or set it to `false`.
 *
 * @param {boolean} [initialValue] - The initial value of the boolean state. Defaults to `false`.
 * @returns {{
 *   value: boolean;
 *   toggle: () => void;
 *   setTrue: () => void;
 *   setFalse: () => void;
 * }} An object containing:
 *   - `value`: The current boolean state.
 *   - `toggle`: Function to invert the current value.
 *   - `setTrue`: Function to set the value to `true`.
 *   - `setFalse`: Function to set the value to `false`.
 *
 * @example
 * ```tsx
 * import { useBoolean } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const { value, toggle, setTrue, setFalse } = useBoolean(false);
 *
 *   return (
 *     <div>
 *       <p>Value: {value ? 'True' : 'False'}</p>
 *       <button onClick={toggle}>Toggle</button>
 *       <button onClick={setTrue}>Set True</button>
 *       <button onClick={setFalse}>Set False</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useBoolean = (
  initialValue: boolean = false,
): {
  value: boolean
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
} => {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => setValue(previous => !previous), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}
