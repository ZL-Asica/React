import type { Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from '@/hooks/async'

describe('useFetch', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.fetch = originalFetch
  })

  it('fetches data successfully', async () => {
    ;(globalThis.fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ data: 'test data' }),
    })

    const { result } = renderHook(() =>
      useFetch<{ data: string }>('https://api.example.com/data'),
    )

    // At some point it should be loading
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    // And eventually it should resolve with data
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual({ data: 'test data' })
      expect(result.current.error).toBeNull()
    })
  })

  it('handles HTTP error responses', async () => {
    ;(globalThis.fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    })

    const { result } = renderHook(() =>
      useFetch('https://api.example.com/error'),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  it('handles network errors (rejected fetch)', async () => {
    ;(globalThis.fetch as unknown as Mock).mockRejectedValueOnce(
      new Error('Network Error'),
    )

    const { result } = renderHook(() =>
      useFetch('https://api.example.com/network-error'),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual(new Error('Network Error'))
    })
  })

  it('normalizes non-Error rejections to `Unknown error`', async () => {
    class SomeCustomError {
      constructor(public message: string = '') {}
    }

    ;(globalThis.fetch as unknown as Mock).mockRejectedValueOnce(
      new SomeCustomError('Custom Error'),
    )

    const { result } = renderHook(() =>
      useFetch('https://api.example.com/unknown-error'),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual(new Error('Unknown error'))
    })
  })

  it('refetches when URL changes and keeps only the latest data', async () => {
    ;(globalThis.fetch as unknown as Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ data: 'first' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ data: 'second' }),
      })

    const { result, rerender } = renderHook(
      ({ url }) => useFetch<{ data: string }>(url),
      {
        initialProps: { url: 'https://api.example.com/first' },
      },
    )

    // Wait for the first fetch to resolve
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual({ data: 'first' })
    })

    // Change URL → hook should refetch and update with new data
    rerender({ url: 'https://api.example.com/second' })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual({ data: 'second' })
    })

    expect((globalThis.fetch as Mock).mock.calls).toHaveLength(2)
  })

  it('falls back to "Fetch failed" when statusText is missing', async () => {
    ;(globalThis.fetch as unknown as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: '', // simulate missing/empty statusText
        json: async () => ({}),
      })

    const { result } = renderHook(() =>
      useFetch('https://api.example.com/missing-status-text'),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toEqual(new Error('Fetch failed'))
    })
  })
})
