import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

import { useDebouncedCallback } from '@/hooks/state'
import { useAdaptiveEffect } from './useAdaptiveEffect'

/**
 * A React hook for attaching an event listener to a target element with automatic cleanup.
 * It supports DOM elements, `window`, `document`, and `MediaQueryList`, and optionally
 * debounces the handler.
 *
 * @template KW - Keys of `WindowEventMap`.
 * @template KH - Keys shared by `HTMLElementEventMap` and `SVGElementEventMap`.
 * @template KM - Keys of `MediaQueryListEventMap`.
 * @template T  - Type of the target element.
 *
 * @param {KW | KH | KM} eventName - The name of the event to listen for (e.g. `'click'`, `'resize'`).
 * @param {(event: WindowEventMap[KW] | HTMLElementEventMap[KH] | SVGElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void} handler
 *   The callback function to handle the event.
 * @param {RefObject<T>} [element] - The target element ref. Defaults to `window` when not provided.
 * @param {boolean | AddEventListenerOptions} [options] - Options passed to `addEventListener`.
 * @param {number} [debounce] - Debounce delay in milliseconds. `0` or `undefined` disables debouncing.
 *
 * @example
 * // Window resize with debounce
 * useEventListener('resize', () => {
 *   console.log('Window resized');
 * }, undefined, undefined, 300);
 *
 * @example
 * // Button click
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener('click', () => {
 *   console.log('Button clicked');
 * }, buttonRef);
 *
 * @example
 * // Document keydown
 * const documentRef = useRef<Document>(document);
 * useEventListener('keydown', (event) => {
 *   console.log('Key pressed:', event.key);
 * }, documentRef, { capture: true });
 *
 * @example
 * // Media query change
 * const mediaQueryListRef = useRef(window.matchMedia('(max-width: 600px)'));
 * useEventListener(
 *   'change',
 *   (event) => {
 *     console.log('Media query matches:', event.matches);
 *   },
 *   mediaQueryListRef
 * );
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
  const shouldDebounce = typeof debounce === 'number' && debounce > 0
  const effectiveHandler = shouldDebounce ? debouncedHandler : handler

  // Keep `savedHandler` in sync with the latest effective handler
  useAdaptiveEffect(() => {
    savedHandler.current = effectiveHandler
  }, [effectiveHandler])

  useEffect(() => {
    // SSR / non-browser guard
    /* v8 ignore if -- @preserve */
    if (typeof window === 'undefined') {
      return
    }

    const target: T | Window | null | undefined = element?.current ?? window

    if (target === undefined || target === null || !('addEventListener' in target)) {
      return
    }

    const eventListener = (event: Event): void => {
      savedHandler.current(event as never)
    }

    target.addEventListener(eventName, eventListener, options)

    return () => {
      target.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options])
}
