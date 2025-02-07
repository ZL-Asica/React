import { useSessionStorage } from '@/hooks/state'

import { act, renderHook } from '@testing-library/react'

describe('useSessionStorage', () => {
  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store: Record<string, string> = {}
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value
        },
        removeItem: (key: string) => {
          delete store[key]
        },
        clear: () => {
          store = {}
        },
      }
    })()
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    })
  })

  it('should initialize with the default value when no data is stored', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    expect(result.current.value).toBe('default_value')
    expect(result.current.error).toBeNull()
  })

  it('should initialize with the stored value from sessionStorage', () => {
    sessionStorage.setItem('test_key', JSON.stringify('stored_value'))

    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    expect(result.current.value).toBe('stored_value')
    expect(result.current.error).toBeNull()
  })

  it('should update the value in state and sessionStorage', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    act(() => {
      result.current.setValue('updated_value')
    })

    expect(result.current.value).toBe('updated_value')
    expect(sessionStorage.getItem('test_key')).toBe(
      JSON.stringify('updated_value'),
    )
    expect(result.current.error).toBeNull()
  })

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useSessionStorage('counter', 0))

    act(() => {
      result.current.setValue(currentValue => currentValue + 1)
    })

    expect(result.current.value).toBe(1)
    expect(sessionStorage.getItem('counter')).toBe(JSON.stringify(1))
    expect(result.current.error).toBeNull()
  })

  it('should handle invalid JSON gracefully', () => {
    sessionStorage.setItem('test_key', 'invalid_json')

    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    expect(result.current.value).toBe('default_value')
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should handle errors during setValue gracefully', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    Object.defineProperty(globalThis.sessionStorage, 'setItem', {
      value: () => {
        throw new Error('Storage failed')
      },
    })

    act(() => {
      result.current.setValue('new_value')
    })

    expect(result.current.value).toBe('default_value') // Value remains unchanged
    expect(result.current.error?.message).toBe('Storage failed')
  })

  it('should handle non-Error types during getStoredValue gracefully', () => {
    // Mock sessionStorage.getItem to throw a non-Error type
    Object.defineProperty(globalThis.sessionStorage, 'getItem', {
      value: () => {
        // eslint-disable-next-line no-throw-literal
        throw 'Non-Error type'
      },
      configurable: true,
    })

    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    expect(result.current.value).toBe('default_value') // Default value is returned
    expect(result.current.error).toBeInstanceOf(Error) // Error is converted to a proper Error instance
    expect(result.current.error?.message).toBe('Unknown error')
  })

  it('should handle non-Error types during setValue gracefully', () => {
    const { result } = renderHook(() =>
      useSessionStorage('test_key', 'default_value'),
    )

    // Mock sessionStorage.setItem to throw a non-Error type
    Object.defineProperty(globalThis.sessionStorage, 'setItem', {
      value: () => {
        // eslint-disable-next-line no-throw-literal
        throw { unexpected: 'object' } // Non-Error object type
      },
      configurable: true,
    })

    act(() => {
      result.current.setValue('new_value')
    })

    expect(result.current.value).toBe('default_value') // Value remains unchanged
    expect(result.current.error).toBeInstanceOf(Error) // Error is converted to a proper Error instance
    expect(result.current.error?.message).toBe('Unknown error')
  })
})
