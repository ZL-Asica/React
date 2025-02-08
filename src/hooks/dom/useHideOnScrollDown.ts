'use client'

import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useEventListener } from './useEventListener'

/**
 * useHideOnScrollDown
 *
 * Custom hook to toggle visibility on scroll.
 * It hides the element when scrolling down and shows it when scrolling up.
 *
 * @param {React.RefObject<HTMLElement>} [targetRef] - The reference to the target element (e.g., header). If not provided, defaults to `null` (uses `threshold`).
 * @param {number} [threshold] - The scroll position threshold before hiding (used if `targetRef` is not provided).
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
  targetRef?: RefObject<HTMLElement>,
  threshold: number = 50,
): boolean => {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const [hideThreshold, setHideThreshold] = useState(
    targetRef?.current?.offsetHeight ?? threshold,
  )

  // When targetRef changes, update the hideThreshold
  useEffect(() => {
    setHideThreshold(targetRef?.current?.offsetHeight ?? threshold)
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
