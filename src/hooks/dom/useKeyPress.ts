import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A React hook that tracks whether a specific keyboard key is currently pressed.
 *
 * This is useful for:
 * - Implementing keyboard shortcuts (e.g. `Escape` to close a modal).
 * - Responding to navigation keys (e.g. `ArrowUp`, `ArrowDown`).
 * - Showing UI hints based on key state (e.g. `Shift` / `Ctrl` being held).
 *
 * Internally, it:
 * - Listens to global `keydown` and `keyup` events on `window`.
 * - Compares `event.key` with the provided `targetKey` (case-sensitive).
 * - Sets `true` on `keydown` and `false` on `keyup` for the matching key.
 * - Optionally debounces the updates via {@link useEventListener}.
 *
 * @param {string} targetKey
 *   The key to detect (e.g. `'Enter'`, `'Escape'`, `'a'`, `'ArrowUp'`).
 *   Comparison is done against `KeyboardEvent.key`, so it is **case-sensitive**.
 *
 * @param {number} [debounce]
 *   Debounce delay in milliseconds for the underlying event listener.
 *   - `0` (default) means the state updates immediately on key events.
 *   - A positive value (e.g. `200`) delays state updates until the user
 *     stops triggering key events for at least that long.
 *
 * @returns {boolean}
 *   `true` if the target key is currently pressed, `false` otherwise.
 *
 * @example
 * // Detect when the Enter key is pressed
 * ```tsx
 * const MyComponent = () => {
 *   const isEnterPressed = useKeyPress('Enter');
 *
 *   return (
 *     <p>Press Enter: {isEnterPressed ? 'Yes' : 'No'}</p>
 *   );
 * };
 * ```
 *
 * @example
 * // Detect Escape with a small debounce
 * ```tsx
 * const MyComponent = () => {
 *   const isEscapePressed = useKeyPress('Escape', 150);
 *
 *   return (
 *     <p>Escape pressed: {isEscapePressed ? 'Yes' : 'No'}</p>
 *   );
 * };
 * ```
 */
export const useKeyPress = (
  targetKey: string,
  debounce: number = 0,
): boolean => {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key === targetKey) {
      setKeyPressed(true)
    }
  }

  const upHandler = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key === targetKey) {
      setKeyPressed(false)
    }
  }

  // Listen on window by default
  useEventListener('keydown', downHandler, undefined, undefined, debounce)
  useEventListener('keyup', upHandler, undefined, undefined, debounce)

  return keyPressed
}
