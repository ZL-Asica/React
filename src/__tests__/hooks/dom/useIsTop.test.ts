import { act, renderHook } from '@testing-library/react'

import { useIsTop } from '@/hooks/dom'

describe('useIsTop', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 1000,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 100, // Start with some scroll offset
      writable: true,
    })
  })

  it('should return false when not at the top', () => {
    const { result } = renderHook(() => useIsTop())
    act(() => {
      document.documentElement.scrollTop = 10
      globalThis.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
  })

  it('should return true when scrolled to the top', () => {
    const { result } = renderHook(() => useIsTop(50))

    act(() => {
      document.documentElement.scrollTop = 40 // Close enough with offset
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })

  it('should handle offset correctly', () => {
    const { result } = renderHook(() => useIsTop(100))

    act(() => {
      document.documentElement.scrollTop = 110 // Beyond the offset
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)

    act(() => {
      document.documentElement.scrollTop = 90 // Exactly within offset
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })

  it('should handle target without scrollTop', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollTop', {
      get: () => undefined, // Simulate no scrollTop
      configurable: true,
    })
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(mockElement, 'clientHeight', {
      value: 1000,
      configurable: true,
    })

    const { result } = renderHook(() => useIsTop(50, mockElement))

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true) // Defaults to 0 for scrollTop
  })

  it('should handle target without scrollHeight', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollTop', {
      value: 0, // Simulate at the top
      configurable: true,
    })
    Object.defineProperty(mockElement, 'scrollHeight', {
      get: () => undefined, // Simulate no scrollHeight
      configurable: true,
    })
    Object.defineProperty(mockElement, 'clientHeight', {
      value: 1000,
      configurable: true,
    })

    const { result } = renderHook(() => useIsTop(50, mockElement))

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true) // Defaults to 0 for scrollHeight, so isTop should be true
  })

  it('should handle target without clientHeight', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollTop', {
      value: 0, // Simulate at the top
      configurable: true,
    })
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    })
    Object.defineProperty(mockElement, 'clientHeight', {
      get: () => undefined, // Simulate no clientHeight
      configurable: true,
    })

    const { result } = renderHook(() => useIsTop(50, mockElement))

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true) // Defaults to 0 for clientHeight, so isTop should be true
  })
})
