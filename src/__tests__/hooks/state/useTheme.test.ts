import { useTheme } from '@/hooks/state'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, vi } from 'vitest'

const THEME_STORAGE_KEY = 'testing-color-theme'

// Mock matchMedia for system preference
const mockMatchMedia = (isDark: boolean) => {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
    matches: isDark,
    // eslint-disable-next-line ts/no-unsafe-assignment
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })))
}

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    mockMatchMedia(false) // Default system to light mode
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should default to system theme when no localStorage value', () => {
    mockMatchMedia(true) // Set system to dark mode

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result.current.isDarkTheme).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should default to light theme when no localStorage value', () => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ theme: 'dark', date: new Date().toISOString() }),
    )

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result.current.isDarkTheme).toBe(true)
  })

  it('should toggle between light and dark themes', () => {
    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.isDarkTheme).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toContain('"theme":"dark"')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.isDarkTheme).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toContain('"theme":"light"')
  })

  it('should expire theme after 3 days', () => {
    const expiredDate = new Date()
    expiredDate.setDate(expiredDate.getDate() - 4) // 4 days ago

    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ theme: 'dark', date: expiredDate.toISOString() }),
    )

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))

    expect(result.current.isDarkTheme).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })

  it('invalid JSON should default to system theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid JSON')

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result.current.isDarkTheme).toBe(false) // Should default to light theme
  })

  it('should handle when date is null', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme: 'dark', date: null }))

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result.current.isDarkTheme).toBe(false) // Should default to light theme
  })

  it('should return null if parsedData is null or not an object', () => {
    // Set null
    localStorage.setItem(THEME_STORAGE_KEY, 'null')

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result.current.isDarkTheme).toBe(false) // Default to light theme
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()

    // Set string
    localStorage.setItem(THEME_STORAGE_KEY, '"invalid string"')

    const { result: result2 } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result2.current.isDarkTheme).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()

    // Set number
    localStorage.setItem(THEME_STORAGE_KEY, '42')

    const { result: result3 } = renderHook(() => useTheme(THEME_STORAGE_KEY))
    expect(result3.current.isDarkTheme).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })

  it('should handle localStorage.getItem throwing an error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Throw error when reading from localStorage
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Storage failure')
      },
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })

    const { result } = renderHook(() => useTheme(THEME_STORAGE_KEY))

    expect(result.current.isDarkTheme).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('Error reading theme:', expect.any(Error))

    consoleSpy.mockRestore()
  })
})
