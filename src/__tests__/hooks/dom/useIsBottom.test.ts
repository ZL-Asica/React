import { useIsBottom } from '@/hooks/dom'

import { act, renderHook } from '@testing-library/react'

describe('useIsBottom', () => {
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
      value: 800,
      writable: true,
    })
  })

  it('should return false when not at the bottom', () => {
    const { result } = renderHook(() => useIsBottom(50))
    expect(result.current).toBe(false)
  })

  it('should return true when scrolled to the bottom', () => {
    const { result } = renderHook(() => useIsBottom(50))

    act(() => {
      document.documentElement.scrollTop = 950 // Close enough with offset
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })

  it('should handle offset correctly', () => {
    const { result } = renderHook(() => useIsBottom(100))

    act(() => {
      document.documentElement.scrollTop = 890 // Near bottom but not within offset
      globalThis.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)

    act(() => {
      document.documentElement.scrollTop = 900 // Exactly at offset
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
      get: () => 2000, // Provide a valid scrollHeight
      configurable: true,
    })
    Object.defineProperty(mockElement, 'clientHeight', {
      get: () => 1000, // Provide a valid clientHeight
      configurable: true,
    })

    const { result } = renderHook(() => useIsBottom(50, mockElement))

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false) // Defaults to 0 for scrollTop
  })

  it('should handle target without scrollHeight', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollTop', {
      get: () => 800, // Provide a valid scrollTop
      configurable: true,
    })
    Object.defineProperty(mockElement, 'scrollHeight', {
      get: () => undefined, // Simulate no scrollHeight
      configurable: true,
    })
    Object.defineProperty(mockElement, 'clientHeight', {
      get: () => 1000, // Provide a valid clientHeight
      configurable: true,
    })

    const { result } = renderHook(() => useIsBottom(50, mockElement))

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false) // Defaults to 0 for scrollHeight
  })

  it('should handle target without clientHeight', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollTop', {
      get: () => 800, // Provide a valid scrollTop
      configurable: true,
    })
    Object.defineProperty(mockElement, 'scrollHeight', {
      get: () => 2000, // Provide a valid scrollHeight
      configurable: true,
    })
    Object.defineProperty(mockElement, 'clientHeight', {
      get: () => undefined, // Simulate no clientHeight
      configurable: true,
    })

    const { result } = renderHook(() => useIsBottom(50, mockElement))

    act(() => {
      mockElement.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false) // Defaults to 0 for clientHeight
  })
})
