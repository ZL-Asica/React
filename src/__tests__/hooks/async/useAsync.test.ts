import { useAsync } from '@/hooks/async'

import { act, renderHook } from '@testing-library/react'

describe('useAsync', () => {
  const mockAsyncFunction = vi.fn().mockResolvedValue('Success!')

  it('should execute the function immediately', async () => {
    const { result } = renderHook(() => useAsync(mockAsyncFunction))

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.result).toBe('Success!')
  })

  it('should set loading state correctly', async () => {
    const { result } = renderHook(() => useAsync(mockAsyncFunction, false))

    expect(result.current.loading).toBe(false)

    act(() => {
      result.current.execute().catch(() => {})
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.result).toBe('Success!')
  })

  it('should handle errors correctly', async () => {
    const mockErrorFunction = vi.fn().mockRejectedValue(new Error('Failure!'))
    const { result } = renderHook(() => useAsync(mockErrorFunction, false))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.error).toEqual(new Error('Failure!'))
  })
})
