import { useFetch } from '@/hooks/async'
import { renderHook, waitFor } from '@testing-library/react'

describe('useFetch', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch data successfully', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test data' }),
    })

    const { result } = renderHook(() =>
      useFetch<{ data: string }>('https://api.example.com/data'),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual({ data: 'test data' })
      expect(result.current.error).toBe(null)
    })
  })

  it('should handle HTTP error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
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
      expect(result.current.data).toBe(null)
      expect(result.current.error).toEqual(new Error('Internal Server Error'))
    })
  })

  it('should handle network error', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
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
      expect(result.current.data).toBe(null)
      expect(result.current.error).toEqual(new Error('Network Error'))
    })
  })

  it('should handle unknown error that is not an instance of Error', async () => {
    class SomeCustomError {
      constructor(public message: string = '') {}
    }
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
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
      expect(result.current.data).toBe(null)
      expect(result.current.error).toEqual(new Error('Unknown error'))
    })
  })
})
