import type { RefObject } from 'react'

import { act, renderHook } from '@testing-library/react'
import { useInViewport } from '@/hooks/dom'

describe('useInViewport', () => {
  let referenceMock: Partial<HTMLElement>

  beforeEach(() => {
    referenceMock = document.createElement('div')
    Object.defineProperty(referenceMock, 'getBoundingClientRect', {
      value: vi.fn(() => ({
        top: 790,
        left: 0,
        bottom: 890,
        right: 100,
        width: 100,
        height: 100,
      })),
      writable: true,
    })

    Object.defineProperty(globalThis, 'innerHeight', {
      value: 800,
      writable: true,
    })
    Object.defineProperty(globalThis, 'innerWidth', {
      value: 600,
      writable: true,
    })
  })

  it('should return true when element is fully in viewport', () => {
    const reference = { current: referenceMock as HTMLElement }
    const { result } = renderHook(() => useInViewport(reference, 0))

    expect(result.current).toBe(true)
  })

  it('should return false when element is out of viewport', () => {
    referenceMock.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 900,
          left: 0,
          bottom: 1000,
          right: 100,
          width: 100,
          height: 100,
        }) as DOMRect,
    )
    const reference = { current: referenceMock as HTMLElement }
    const { result } = renderHook(() => useInViewport(reference, 0))

    expect(result.current).toBe(false)
  })

  it('should respect offset when element is near viewport edge', () => {
    referenceMock.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 790, // Near viewport bottom
          left: 0,
          bottom: 890,
          right: 100,
          width: 100,
          height: 100,
        }) as DOMRect,
    )
    const reference = { current: referenceMock as HTMLElement }
    const { result } = renderHook(() => useInViewport(reference, 50))

    expect(result.current).toBe(true)
  })

  it('should initialize visibility on mount', () => {
    referenceMock.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 400,
          left: 0,
          bottom: 500,
          right: 100,
          width: 100,
          height: 100,
        }) as DOMRect,
    )

    const reference = { current: referenceMock as HTMLElement }
    const { result } = renderHook(() => useInViewport(reference, 0))

    expect(result.current).toBe(true) // Initial visibility check
  })

  it('should handle missing ref', () => {
    const reference = { current: null } as unknown as RefObject<HTMLElement>
    const { result } = renderHook(() => useInViewport(reference, 0))

    expect(result.current).toBe(false)
  })

  it('should update visibility when scroll / resize events fire', () => {
    vi.useFakeTimers()

    // Initial, element is out of viewport
    referenceMock.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 900,
          left: 0,
          bottom: 1000,
          right: 100,
          width: 100,
          height: 100,
        }) as DOMRect,
    )

    const reference = {
      current: referenceMock as HTMLElement,
    } as RefObject<HTMLElement>

    const { result } = renderHook(() =>
      // Here debounce is set to 0 for convenience with fake timers
      useInViewport(reference, 0, 0),
    )

    expect(result.current).toBe(false)

    // Move the element "into" the viewport
    referenceMock.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 400,
          left: 0,
          bottom: 500,
          right: 100,
          width: 100,
          height: 100,
        }) as DOMRect,
    )

    act(() => {
      reference.current?.dispatchEvent(new Event('scroll'))
      vi.runAllTimers()
    })

    expect(result.current).toBe(true)

    // Move the element "out of" the viewport, trigger by resize
    referenceMock.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 900,
          left: 0,
          bottom: 1000,
          right: 100,
          width: 100,
          height: 100,
        }) as DOMRect,
    )

    act(() => {
      window.dispatchEvent(new Event('resize'))
      vi.runAllTimers()
    })

    expect(result.current).toBe(false)

    vi.useRealTimers()
  })

  it('falls back to documentElement client size when innerHeight/innerWidth are falsy', () => {
    // Let window's innerHeight / innerWidth become falsy
    Object.defineProperty(globalThis, 'innerHeight', {
      value: 0,
      writable: true,
    })
    Object.defineProperty(globalThis, 'innerWidth', {
      value: 0,
      writable: true,
    })

    // Provide documentElement's clientHeight / clientWidth, triggering fallback
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 800,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 600,
      writable: true,
    })

    const element = document.createElement('div')

    Object.defineProperty(element, 'getBoundingClientRect', {
      value: vi.fn(
        () =>
          ({
            top: 400,
            left: 0,
            bottom: 500,
            right: 100,
            width: 100,
            height: 100,
          }) as DOMRect,
      ),
      writable: true,
    })

    const reference = { current: element } as RefObject<HTMLElement>

    const { result } = renderHook(() =>
      useInViewport(reference, 0, 0),
    )

    // Here computeVisibility will use:
    // viewportHeight = 0 || 800 → 800
    // viewportWidth  = 0 || 600 → 600
    expect(result.current).toBe(true)
  })
})
