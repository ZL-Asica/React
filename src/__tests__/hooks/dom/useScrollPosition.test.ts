import { act, renderHook } from '@testing-library/react'
import {
  __INTERNAL__computeScrollPosition as computeScrollPositionInternal,
  useScrollPosition,
} from '@/hooks/dom/useScrollPosition'

describe('useScrollPosition', () => {
  beforeEach(() => {
    // Default starting value for global scroll
    Object.defineProperty(globalThis, 'scrollY', {
      value: 0,
      writable: true,
    })

    // Provide a reasonable scroll range for the document
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 1000,
      writable: true,
    })
  })

  it('uses current scroll position instead of initialValue when DOM is available', () => {
    // scrollY is 0; even though initialValue is 123, the hook should use DOM value
    const { result } = renderHook(() =>
      useScrollPosition(globalThis, false, 0, 123),
    )
    expect(result.current).toBe(0)
  })

  it('tracks global scroll position (pixels)', () => {
    const { result } = renderHook(() => useScrollPosition())

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 100,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(100)

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 250,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(250)
  })

  it('tracks scroll position of a specific container (pixels)', () => {
    const container = document.createElement('div')

    Object.defineProperty(container, 'scrollTop', {
      value: 200,
      writable: true,
    })
    Object.defineProperty(container, 'scrollHeight', {
      value: 1000,
      writable: true,
    })
    Object.defineProperty(container, 'clientHeight', {
      value: 500,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition(container))

    // Simulate container scroll
    act(() => {
      Object.defineProperty(container, 'scrollTop', {
        value: 300,
        writable: true,
      })
      container.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(300)
  })

  it('initializes global scroll position from DOM on mount', () => {
    Object.defineProperty(globalThis, 'scrollY', {
      value: 250,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition())
    expect(result.current).toBe(250)
  })

  it('returns percentage for global scroll when percentage = true', () => {
    // scrollHeight = 2000, clientHeight = 1000 → scrollable = 1000
    const { result } = renderHook(() => useScrollPosition(globalThis, true))

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 1000,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(100)

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 500,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(50)
  })

  it('returns percentage for a specific container when percentage = true', () => {
    const container = document.createElement('div')

    Object.defineProperty(container, 'scrollTop', {
      value: 250,
      writable: true,
    })
    Object.defineProperty(container, 'scrollHeight', {
      value: 1000,
      writable: true,
    })
    Object.defineProperty(container, 'clientHeight', {
      value: 500,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition(container, true))

    act(() => {
      Object.defineProperty(container, 'scrollTop', {
        value: 500,
        writable: true,
      })
      container.dispatchEvent(new Event('scroll'))
    })

    // scrollable = 1000 - 500 = 500, scrollTop = 500 → 100%
    expect(result.current).toBe(100)

    act(() => {
      Object.defineProperty(container, 'scrollTop', {
        value: 250,
        writable: true,
      })
      container.dispatchEvent(new Event('scroll'))
    })

    // 250 / 500 = 0.5 → 50%
    expect(result.current).toBe(50)
  })

  it('handles HTMLElement with zero scrollable height', () => {
    const container = document.createElement('div')

    Object.defineProperty(container, 'scrollHeight', {
      value: 500,
      writable: true,
    })
    Object.defineProperty(container, 'clientHeight', {
      value: 500,
      writable: true,
    })
    Object.defineProperty(container, 'scrollTop', {
      value: 200,
      writable: true,
    })

    // percentage = true → scrollableHeight === 0 → result should be 0
    const { result: resultWithPercentage } = renderHook(() =>
      useScrollPosition(container, true),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithPercentage.current).toBe(0)

    // percentage = false → should return scrollTop
    const { result: resultWithoutPercentage } = renderHook(() =>
      useScrollPosition(container, false),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithoutPercentage.current).toBe(200)
  })

  it('handles global scroll with zero scrollable height', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 500,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 500,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: 200,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition(globalThis, true))

    act(() => {
      globalThis.dispatchEvent(new Event('scroll'))
    })

    // scrollableHeight === 0 → percentage should be 0
    expect(result.current).toBe(0)
  })

  it('handles HTMLElement with scrollTop undefined', () => {
    const container = document.createElement('div')

    Object.defineProperty(container, 'scrollTop', {
      value: undefined,
      writable: true,
    })
    Object.defineProperty(container, 'scrollHeight', {
      value: 1000,
      writable: true,
    })
    Object.defineProperty(container, 'clientHeight', {
      value: 500,
      writable: true,
    })

    const { result: resultWithPercentage } = renderHook(() =>
      useScrollPosition(container, true),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    // scrollTop || 0 → 0
    expect(resultWithPercentage.current).toBe(0)

    const { result: resultWithoutPercentage } = renderHook(() =>
      useScrollPosition(container, false),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithoutPercentage.current).toBe(0)
  })

  it('coerces NaN scroll calculations back to 0', () => {
    // Force scrollableHeight to become NaN
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 'not-a-number',
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 500,
      writable: true,
    })
    Object.defineProperty(globalThis, 'scrollY', {
      value: 100,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition(globalThis, true))

    // Initial calculation should be NaN → coerced to 0
    expect(result.current).toBe(0)

    act(() => {
      globalThis.dispatchEvent(new Event('scroll'))
    })

    // After scroll, value should still be coerced to 0
    expect(result.current).toBe(0)
  })

  it('does nothing when window or document are missing in the scroll handler', () => {
    const { result } = renderHook(() =>
      useScrollPosition(globalThis, false, 0, 123),
    )

    const initial = result.current

    // Temporarily simulate a non-browser environment for the handler
    const originalWindow = globalThis.window
    const originalDocument = globalThis.document

    // @ts-expect-error - override globals for test
    globalThis.window = undefined
    // @ts-expect-error - override globals for test
    globalThis.document = undefined

    act(() => {
      globalThis.dispatchEvent(new Event('scroll'))
    })

    // The handler should bail out early and leave the value unchanged
    expect(result.current).toBe(initial)

    // Restore globals so other tests are not affected
    globalThis.window = originalWindow
    globalThis.document = originalDocument
  })

  it('returns 0 from computeScrollPosition when window and document are missing', () => {
    const originalWindow = globalThis.window
    const originalDocument = globalThis.document

    // @ts-expect-error - override globals for test
    globalThis.window = undefined
    // @ts-expect-error - override globals for test
    globalThis.document = undefined

    const value = computeScrollPositionInternal(globalThis, false)

    expect(value).toBe(0)

    globalThis.window = originalWindow
    globalThis.document = originalDocument
  })
})
