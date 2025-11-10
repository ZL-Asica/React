import type { RefObject } from 'react'

import { renderHook } from '@testing-library/react'
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
})
