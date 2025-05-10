import { useState } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A custom React hook to track whether a specific key is pressed. This hook is useful for implementing keyboard shortcuts or detecting specific key actions in your application.
 * The key detection is case-sensitive and supports optional debouncing for optimized performance during rapid key presses.
 *
 * @param {string} targetKey - The key to detect (e.g., 'Enter', 'Escape', 'a'). The key is case-sensitive.
 * @param {number} [debounce] - The debounce delay in milliseconds for the event listener. Defaults to `0` (no debounce).
 * @returns {boolean} `true` if the target key is currently pressed, `false` otherwise.
 *
 * @example
 * Example: Detect when the Enter key is pressed
 * ```tsx
 * import { useKeyPress } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const isEnterPressed = useKeyPress('Enter');
 *
 *   return (
 *     <div>
 *       <p>Press the Enter key: {isEnterPressed ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * Example: Detect when the Escape key is pressed with debounce
 * ```tsx
 * import { useKeyPress } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const isEscapePressed = useKeyPress('Escape', 200); // Debounced by 200ms
 *
 *   return (
 *     <div>
 *       <p>Press the Escape key: {isEscapePressed ? 'Yes' : 'No'}</p>
 *     </div>
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

  useEventListener('keydown', downHandler, undefined, undefined, debounce)
  useEventListener('keyup', upHandler, undefined, undefined, debounce)

  return keyPressed
}
