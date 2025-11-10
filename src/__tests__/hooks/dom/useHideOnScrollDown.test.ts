import { act, renderHook } from '@testing-library/react'
import { useHideOnScrollDown } from '@/hooks/dom'

describe('useHideOnScrollDown', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'scrollY', { value: 0, writable: true })
  })

  it('should initialize as visible', () => {
    const { result } = renderHook(() => useHideOnScrollDown())
    expect(result.current).toBe(true)
  })

  it('should stay visible when scrolling up', () => {
    const { result } = renderHook(() => useHideOnScrollDown())

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 10, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
      Object.defineProperty(globalThis, 'scrollY', { value: 5, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })

  it('should hide when scrolling down past threshold', () => {
    const { result } = renderHook(() => useHideOnScrollDown(undefined, 30))

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 40, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)
  })

  it('should show again when scrolling up after being hidden', () => {
    const { result } = renderHook(() => useHideOnScrollDown(undefined, 30))

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 40, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 20, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })

  it('should use targetRef height if provided', () => {
    const container = document.createElement('div')
    Object.defineProperty(container, 'offsetHeight', { value: 60, writable: true })
    const targetRef = { current: container } as React.RefObject<HTMLElement>

    const { result } = renderHook(() => useHideOnScrollDown(targetRef))

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 70, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)
  })

  it('should handle null targetRef gracefully', () => {
    const targetRef = { current: null } as unknown as React.RefObject<HTMLElement>
    const { result } = renderHook(() => useHideOnScrollDown(targetRef, 50))

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 60, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)
  })

  it('should update visibility state when ref changes', () => {
    const container1 = document.createElement('div')
    Object.defineProperty(container1, 'offsetHeight', { value: 40, writable: true })

    const container2 = document.createElement('div')
    Object.defineProperty(container2, 'offsetHeight', { value: 80, writable: true })

    const targetRef = { current: container1 } as React.RefObject<HTMLElement>

    const { rerender, result } = renderHook(
      ({ ref }) => useHideOnScrollDown(ref),
      { initialProps: { ref: targetRef } },
    )

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 50, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)

    act(() => {
      targetRef.current = container2
      rerender({ ref: targetRef })
    })

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 70, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
  })

  it('should support default window target', () => {
    const { result } = renderHook(() => useHideOnScrollDown())

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 100, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(globalThis, 'scrollY', { value: 50, writable: true })
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })
})
