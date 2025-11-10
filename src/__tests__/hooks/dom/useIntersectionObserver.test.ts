import type { RefObject } from 'react'
import { act, renderHook } from '@testing-library/react'
import { useIntersectionObserver } from '@/hooks/dom'

let originalIntersectionObserver: typeof IntersectionObserver | undefined

// For assertions
let lastObserver: MockIntersectionObserver | null = null
let lastCallback: IntersectionObserverCallback | null = null
let lastOptions: IntersectionObserverInit | undefined

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  observe = vi.fn<(target: Element) => void>()
  unobserve = vi.fn<(target: Element) => void>()
  disconnect = vi.fn<() => void>()
  takeRecords = vi.fn<() => IntersectionObserverEntry[]>(() => [])

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    MockIntersectionObserver.setLastInstance(this, callback, options)
  }

  static setLastInstance(
    instance: MockIntersectionObserver,
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    lastObserver = instance
    lastCallback = callback
    lastOptions = options
  }
}

// Replace / return back global IntersectionObserver
beforeAll(() => {
  originalIntersectionObserver = globalThis.IntersectionObserver
  globalThis.IntersectionObserver = MockIntersectionObserver
})

// Clear state before each test
beforeEach(() => {
  lastObserver = null
  lastCallback = null
  lastOptions = undefined
  vi.clearAllMocks()
})

afterAll(() => {
  if (originalIntersectionObserver) {
    globalThis.IntersectionObserver = originalIntersectionObserver
  }
})

describe('useIntersectionObserver', () => {
  it('should observe and unobserve the element', () => {
    const reference = { current: document.createElement('div') }

    const { unmount } = renderHook(() =>
      useIntersectionObserver(reference),
    )

    // Created observer
    expect(lastObserver).not.toBeNull()
    expect(lastObserver!.observe).toHaveBeenCalledWith(reference.current)

    unmount()

    expect(lastObserver!.unobserve).toHaveBeenCalledWith(reference.current)
    expect(lastObserver!.disconnect).toHaveBeenCalled()
  })

  it('should handle ref being null', () => {
    const reference = { current: null } as unknown as RefObject<HTMLElement>

    const { unmount } = renderHook(() =>
      useIntersectionObserver(reference),
    )

    // When ref is null, IntersectionObserver is never created
    expect(lastObserver).toBeNull()

    unmount()
    // Nothing was called
  })

  it('should update isIntersecting when the observer triggers', () => {
    const reference = { current: document.createElement('div') }

    const { result } = renderHook(() =>
      useIntersectionObserver(reference),
    )

    expect(lastCallback).not.toBeNull()

    // Trigger entering the viewport
    act(() => {
      lastCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        lastObserver as unknown as IntersectionObserver,
      )
    })
    expect(result.current).toBe(true)

    // Trigger leaving the viewport
    act(() => {
      lastCallback!(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        lastObserver as unknown as IntersectionObserver,
      )
    })
    expect(result.current).toBe(false)
  })

  it('should pass options to IntersectionObserver', () => {
    const options: IntersectionObserverInit = { threshold: 0.5 }
    const reference = { current: document.createElement('div') }

    renderHook(() => useIntersectionObserver(reference, options))

    // Directly assert with the options we recorded, simpler than spying on the constructor
    expect(lastOptions).toEqual(options)
    expect(lastObserver).not.toBeNull()
    expect(lastObserver!.observe).toHaveBeenCalledWith(reference.current)
  })
})
