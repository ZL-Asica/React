import type { RefObject } from 'react'

import { useEventListener } from './useEventListener'

/**
 * A React hook that invokes a handler when the user clicks or touches
 * **outside** of the given element.
 *
 * This is especially useful for:
 * - Closing dropdowns or select menus when the user clicks elsewhere.
 * - Dismissing modals, popovers, or sidebars.
 * - Hiding context menus or tooltips when the user interacts outside.
 *
 * Internally, this hook:
 * - Listens to global `'mousedown'` and `'touchstart'` events.
 * - Ignores events that originate from inside the referenced element.
 * - Calls the provided `handler` once for each qualifying outside interaction.
 * - Supports optional debouncing via {@link useEventListener}.
 *
 * @param {RefObject<HTMLElement | null>} reference
 *   Ref to the target element. Any interaction that happens **outside** this
 *   element will trigger the handler. If `reference.current` is `null`, the
 *   hook does nothing until the element is mounted.
 *
 * @param {() => void} handler
 *   Callback to run when an outside click or touch is detected.
 *   Typical usage is to close or hide UI, e.g. `setOpen(false)`.
 *
 * @param {number} [debounce]
 *   Debounce delay in milliseconds applied to the underlying event listener.
 *   - `0` or `undefined` means no debouncing.
 *   - A positive value (e.g. `200`) will delay the handler until the user
 *     stops interacting for at least that many milliseconds.
 *
 * @example
 * // Close a dropdown when clicking outside
 * ```tsx
 * const Dropdown = () => {
 *   const [open, setOpen] = useState(false);
 *   const ref = useRef<HTMLDivElement | null>(null);
 *
 *   useClickOutside(ref, () => setOpen(false));
 *
 *   return (
 *     <div>
 *       <button onClick={() => setOpen((prev) => !prev)}>Toggle</button>
 *       {open && (
 *         <div ref={ref}>
 *           Dropdown content
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * // Close a modal with a small debounce to avoid rapid flicker
 * ```tsx
 * const Modal = () => {
 *   const [open, setOpen] = useState(true);
 *   const modalRef = useRef<HTMLDivElement | null>(null);
 *
 *   useClickOutside(modalRef, () => setOpen(false), 150);
 *
 *   if (!open) return null;
 *
 *   return (
 *     <div className="backdrop">
 *       <div ref={modalRef} className="modal">
 *         Modal content
 *       </div>
 *     </div>
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
    const element = reference.current

    // If there is no element mounted yet, do nothing.
    if (!element) {
      return
    }

    const target = event.target as Node | null

    // Ignore events that originate from inside the element.
    if (target && element.contains(target)) {
      return
    }

    handler()
  }

  // Attach global listeners on the window for pointer-like events
  useEventListener('mousedown', listener, undefined, undefined, debounce)
  useEventListener('touchstart', listener, undefined, undefined, debounce)
}
