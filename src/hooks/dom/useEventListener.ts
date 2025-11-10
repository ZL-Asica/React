import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

import { useDebouncedCallback } from '@/hooks/state'

import { useAdaptiveEffect } from './useAdaptiveEffect'

/**
 * A custom React hook for attaching an event listener to a target element with automatic cleanup.
 * This hook is useful for adding event listeners to DOM elements or the window object.
 * It also supports optional debouncing to limit how often the handler is invoked.
 *
 * @param {string} eventName - The name of the event to listen for (e.g., 'click', 'keydown').
 * @param {(event: T) => void} handler - The callback function to handle the event. Receives the event object as a parameter.
 * @param {EventTarget | null | undefined} [element] - The target element to attach the event listener to. Defaults to `globalThis` if not provided.
 * @param {boolean | AddEventListenerOptions} [options] - Additional options to pass to `addEventListener`. Such as `capture` or `once`, etc.
 * @param {number} [debounce] - The debounce delay in milliseconds. Defaults to 0ms (no debounce).
 * @template T - The type of the event object.
 *
 * @example
 * Example 1: Attach a window event listener with debounce
 * ```tsx
 * useEventListener('resize', () => {
 *   console.log('Window resized!');
 * }, undefined, undefined, 300);
 * ```
 *
 * @example
 * Example 2: Attach a button click listener
 * ```tsx
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener('click', () => {
 *   console.log('Button clicked!');
 * }, buttonRef);
 * ```
 *
 * @example
 * Example 3: Attach a document event listener
 * ```tsx
 * const documentRef = useRef<Document>(document);
 * useEventListener('keydown', (event) => {
 *   console.log('Key pressed:', event.key);
 * }, documentRef, { capture: true });
 * ```
 *
 * @example
 * Example 4: Attach a media query change listener
 * ```tsx
 * const mediaQueryListRef = useRef(window.matchMedia('(max-width: 600px)'));
 * useEventListener(
 *   'change',
 *   (event) => {
 *     console.log('Media query matches:', event.matches);
 *   },
 *   mediaQueryListRef
 * );
 * ```
 */
export const useEventListener = <
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends
  | HTMLElement
  | SVGElement
  | MediaQueryList
  | Document
  | typeof globalThis = HTMLElement,
>(
  eventName: KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | SVGElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event,
  ) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
  debounce?: number,
): void => {
  const savedHandler = useRef(handler)
  const debouncedHandler = useDebouncedCallback(handler, debounce ?? 0)
  const effectiveHandler = (debounce !== undefined && debounce > 0) ? debouncedHandler : handler

  // Update saved handler whenever it changes
  useAdaptiveEffect(() => {
    savedHandler.current = debouncedHandler
    savedHandler.current = effectiveHandler
  }, [effectiveHandler])
  useEffect(() => {
    if (typeof globalThis === 'undefined') {
      return
    }
    const targetElement: T | Window = element?.current ?? window

    if (targetElement === null || targetElement === undefined) {
      return
    }

    const eventListener = (event: Event): void => savedHandler.current(event)

    targetElement.addEventListener(eventName, eventListener, options)

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options])
}
