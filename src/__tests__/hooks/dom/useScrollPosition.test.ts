import { useScrollPosition } from '@/hooks/dom'

import { act, renderHook } from '@testing-library/react'

describe('useScrollPosition', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'scrollY', { value: 0, writable: true })
  })

  it('should return the initial value', () => {
    const { result } = renderHook(() =>
      useScrollPosition(globalThis, false, 0, 123),
    )
    expect(result.current).toBe(0)
  })

  it('should track global scroll position (window.scrollY)', () => {
    const { result } = renderHook(() => useScrollPosition())

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 100,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(100)
  })

  it('should track scroll position of a specific container', () => {
    const container = document.createElement('div')
    Object.defineProperty(container, 'scrollTop', {
      value: 200,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition(container))

    act(() => {
      Object.defineProperty(container, 'scrollTop', {
        value: 300,
        writable: true,
      })
      container.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(300)
  })

  it('should initialize scroll position on mount', () => {
    Object.defineProperty(globalThis, 'scrollY', {
      value: 250,
      writable: true,
    })

    const { result } = renderHook(() => useScrollPosition())
    expect(result.current).toBe(250)
  })

  it('should update scroll position using window.scrollY when element is globalThis', () => {
    const { result } = renderHook(() => useScrollPosition(globalThis))

    // Simulate scroll event to change window.scrollY
    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 300,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(300)

    // Simulate another scroll event
    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 500,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(500)

    // Reset window.scrollY
    act(() => {
      Object.defineProperty(globalThis, 'scrollY', {
        value: 0,
        writable: true,
      })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(0)
  })

  it('should return scroll position as a percentage when percentage is true', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 1000,
      writable: true,
    })

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

  it('should return scroll position as a percentage for a specific container', () => {
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

    expect(result.current).toBe(100)

    act(() => {
      Object.defineProperty(container, 'scrollTop', {
        value: 250,
        writable: true,
      })
      container.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(50)
  })

  it('should handle HTMLElement with scrollable height equal to 0', () => {
    const container = document.createElement('div')

    // Mock scrollable height equal to 0
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

    // When percentage is true
    const { result: resultWithPercentage } = renderHook(() =>
      useScrollPosition(container, true),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithPercentage.current).toBe(0)

    // When percentage is false
    const { result: resultWithoutPercentage } = renderHook(() =>
      useScrollPosition(container, false),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithoutPercentage.current).toBe(200)
  })

  it('should handle globalThis with scrollable height equal to 0', () => {
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

    expect(result.current).toBe(0)
  })

  it('should handle HTMLElement with scrollTop as undefined', () => {
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

    // When percentage is true
    const { result: resultWithPercentage } = renderHook(() =>
      useScrollPosition(container, true),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithPercentage.current).toBe(0)

    // When percentage is false
    const { result: resultWithoutPercentage } = renderHook(() =>
      useScrollPosition(container, false),
    )

    act(() => {
      container.dispatchEvent(new Event('scroll'))
    })

    expect(resultWithoutPercentage.current).toBe(0)
  })
})
