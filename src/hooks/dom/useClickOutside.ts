'use client'

import type { RefObject } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A custom React hook that detects clicks or touch events outside the specified target element.
 * It is useful for closing dropdowns, modals, or menus when a user interacts outside the specified element.
 * The handler function is called when the user clicks or touches outside the referenced element.
 * Optionally, events can be debounced for better performance in rapid interaction scenarios.
 *
 * @param {RefObject<HTMLElement | null>} reference - The reference to the target element. The hook detects interactions outside this element.
 * @param {() => void} handler - The callback function to execute when a click or touch is detected outside the element.
 * @param {number} [debounce=0] - The debounce delay in milliseconds for the event listener. Defaults to `0` (no debounce).
 *
 * @example
 * Example: Close a dropdown menu when clicking outside
 * ```tsx
 * import { useRef, useState } from 'react';
 * import { useClickOutside } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(ref, () => setIsOpen(false));
 *
 *   return (
 *     <div>
 *       <button onClick={() => setIsOpen(true)}>Open Menu</button>
 *       {isOpen && (
 *         <div ref={ref} style={{ border: '1px solid black', padding: '10px' }}>
 *           This is a dropdown menu. Click outside to close.
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * Example: Close a modal when touching outside
 * ```tsx
 * import { useRef, useState } from 'react';
 * import { useClickOutside } from '@zl-asica/react';
 *
 * const MyComponent = () => {
 *   const [isModalOpen, setIsModalOpen] = useState(false);
 *   const modalRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(modalRef, () => setIsModalOpen(false), 200); // Debounced by 200ms
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
 *       {isModalOpen && (
 *         <div
 *           ref={modalRef}
 *           style={{
 *             position: 'fixed',
 *             top: '50%',
 *             left: '50%',
 *             transform: 'translate(-50%, -50%)',
 *             padding: '20px',
 *             background: 'white',
 *             borderRadius: '10px',
 *             boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
 *           }}
 *         >
 *           <p>This is a modal. Tap outside to close.</p>
 *         </div>
 *       )}
 *     </>
 *   );
 * };
 * ```
 */

export const useClickOutside = (
  reference: RefObject<HTMLElement | null>,
  handler: () => void,
  debounce: number = 0,
): void => {
  const listener = (event: Event): void => {
    if (
      !reference.current
      || reference.current.contains(event.target as Node)
    ) {
      return
    }
    handler()
  }

  // Use our custom event listener hook with generic type
  useEventListener('mousedown', listener, undefined, undefined, debounce)
  useEventListener('touchstart', listener, undefined, undefined, debounce)
}
