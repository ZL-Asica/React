import { useBoolean } from './useBoolean'

/**
 * A custom React hook for managing a boolean toggle state.
 * Provides the current value and a function to toggle it between `true` and `false`.
 *
 * @param {boolean} [initialValue] - The initial state of the toggle. Defaults to `false`.
 * @returns {[boolean, () => void]} An array containing:
 *   - `value`: The current boolean state.
 *   - `toggle`: A function to toggle the state between `true` and `false`.
 *
 * @example
 * ```tsx
 * import { useToggle } from '@zl-asica/react';
 *
 * const ToggleComponent = () => {
 *   const [isOn, toggle] = useToggle(false);
 *
 *   return (
 *     <div>
 *       <p>The toggle is {isOn ? 'ON' : 'OFF'}</p>
 *       <button onClick={toggle}>Toggle</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useToggle = (
  initialValue: boolean = false,
): [boolean, () => void] => {
  const { value, toggle } = useBoolean(initialValue)
  return [value, toggle]
}
