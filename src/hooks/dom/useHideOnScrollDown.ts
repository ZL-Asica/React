'use client'

import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useEventListener } from './useEventListener'

/**
 * Custom hook to toggle visibility on scroll.
 * It hides the element when scrolling down and shows it when scrolling up.
 *
 * @param {React.RefObject<HTMLElement | null>} [targetRef] - The reference to the target element (e.g., header). If not provided, defaults to `null` (uses `threshold`).
 * @param {number} [threshold] - The scroll position threshold before hiding (used if `targetRef` is not provided).
 * For example, if `threshold` is `100`, the element will hide every time the scroll position is greater than `100`.
 * @returns {boolean} - Whether the element should be visible.
 *
 * @example
 * ```tsx
 * const headerRef = useRef<HTMLElement>(null)
 * const isVisible = useHideOnScrollDown(headerRef)
 *
 * return (
 *  <header ref={headerRef} style={{ opacity: isVisible ? 1 : 0 }}>
 *   Header content
 * </header>
 * )
 * ```
 *
 * @example
 * ```tsx
 * const isVisible = useHideOnScrollDown(null, 100)
 *
 * return (
 * <header style={{ opacity: isVisible ? 1 : 0 }}>
 *  Header content
 * </header>
 * )
 */
export const useHideOnScrollDown = (
  targetRef?: RefObject<HTMLElement | null>,
  threshold?: number,
): boolean => {
  const actualThreshold = (targetRef?: RefObject<HTMLElement | null>, threshold?: number): number =>
    threshold !== undefined
      ? threshold
      : targetRef?.current?.offsetHeight ?? 50

  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const [hideThreshold, setHideThreshold] = useState(() => actualThreshold(targetRef, threshold))

  // When targetRef changes, update the hideThreshold
  useEffect(() => {
    setHideThreshold(actualThreshold(targetRef, threshold))
    globalThis.dispatchEvent(new Event('scroll')) // Force update on scroll
  }, [targetRef, threshold])

  useEventListener('scroll', () => {
    const currentScrollY = globalThis.scrollY

    if (currentScrollY < hideThreshold) {
      setIsVisible(true)
    }
    else if (currentScrollY > lastScrollY.current) {
      setIsVisible(false)
    }
    else {
      setIsVisible(true)
    }

    lastScrollY.current = currentScrollY
  })

  return isVisible
}
