import { act, renderHook } from '@testing-library/react'
import {
  __INTERNAL__deriveOnlineStatus,
  __INTERNAL__getInitialOnlineStatus,
  useOnlineStatus,
} from '@/hooks/dom/useOnlineStatus'

describe('useOnlineStatus - internal helpers', () => {
  it('deriveOnlineStatus returns navigatorOnline when hasNavigator is true', () => {
    expect(__INTERNAL__deriveOnlineStatus(true, true)).toBe(true)
    expect(__INTERNAL__deriveOnlineStatus(true, false)).toBe(false)
  })

  it('deriveOnlineStatus defaults to true when hasNavigator is false', () => {
    expect(__INTERNAL__deriveOnlineStatus(false, false)).toBe(true)
    expect(__INTERNAL__deriveOnlineStatus(false, true)).toBe(true)
  })

  it('getInitialOnlineStatus uses navigator.onLine when available', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      window.navigator,
      'onLine',
    )

    try {
      Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: false,
      })
      expect(__INTERNAL__getInitialOnlineStatus()).toBe(false)

      Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: true,
      })
      expect(__INTERNAL__getInitialOnlineStatus()).toBe(true)
    }
    finally {
      if (originalDescriptor) {
        Object.defineProperty(window.navigator, 'onLine', originalDescriptor)
      }
    }
  })

  it('getInitialOnlineStatus defaults to true when navigator is not defined', () => {
    const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'navigator',
    )

    try {
      // mimic no navigator environment
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: undefined,
      })

      // here will go:
      // hasNavigator = typeof navigator === 'undefined' -> false
      // navigatorOnline = hasNavigator ? navigator.onLine : false -> false branch
      // derive(false, false) -> true
      expect(__INTERNAL__getInitialOnlineStatus()).toBe(true)
    }
    finally {
      if (originalNavigatorDescriptor) {
        Object.defineProperty(
          globalThis,
          'navigator',
          originalNavigatorDescriptor,
        )
      }
      else {
        // No original descriptor, delete the property we added
        // @ts-expect-error: cleanup for mocked global
        delete globalThis.navigator
      }
    }
  })
})

describe('useOnlineStatus hook', () => {
  let originalDescriptor: PropertyDescriptor | undefined

  beforeEach(() => {
    originalDescriptor = Object.getOwnPropertyDescriptor(
      window.navigator,
      'onLine',
    )
  })

  afterEach(() => {
    if (originalDescriptor) {
      Object.defineProperty(window.navigator, 'onLine', originalDescriptor)
    }
    vi.restoreAllMocks()
  })

  it('initializes from navigator.onLine', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    })

    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)

    // Change to true and re-render to verify lazy initializer does not recompute
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    })
    const { result: result2 } = renderHook(() => useOnlineStatus())
    expect(result2.current).toBe(true)
  })

  it('updates to true when the "online" event fires', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    })

    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current).toBe(true)
  })

  it('updates to false when the "offline" event fires', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    })

    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current).toBe(false)
  })

  it('handles rapid online/offline toggles correctly', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    })

    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new Event('offline'))
      window.dispatchEvent(new Event('online'))
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current).toBe(false)
  })
})
