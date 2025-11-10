import { act, renderHook, waitFor } from '@testing-library/react'
import { useAsync } from '@/hooks/async'

describe('useAsync', () => {
  it('executes immediately by default', async () => {
    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue('Success!')

    const { result } = renderHook(() => useAsync(asyncFn))

    // Immediately after mount
    expect(asyncFn).toHaveBeenCalledTimes(1)
    expect(result.current.loading).toBe(true)
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.result).toBe('Success!')
      expect(result.current.error).toBeNull()
    })
  })

  it('does not execute immediately when immediate is false', async () => {
    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue('Done')

    const { result } = renderHook(() => useAsync(asyncFn, false))

    expect(asyncFn).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)

    await act(async () => {
      await result.current.execute()
    })

    expect(asyncFn).toHaveBeenCalledTimes(1)
    expect(result.current.loading).toBe(false)
    expect(result.current.result).toBe('Done')
    expect(result.current.error).toBeNull()
  })

  it('passes arguments through to the async function', async () => {
    const asyncFn = vi
      .fn<(count: number, label: string) => Promise<string>>()
      .mockImplementation(async (count, label) => `${label}:${count}`)

    const { result } = renderHook(() =>
      useAsync<string, [number, string]>(asyncFn, false),
    )

    await act(async () => {
      await result.current.execute(3, 'items')
    })

    expect(asyncFn).toHaveBeenCalledWith(3, 'items')
    expect(result.current.result).toBe('items:3')
  })

  it('handles errors correctly', async () => {
    const error = new Error('Failure!')
    const failingFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValue(error)

    const { result } = renderHook(() => useAsync<string>(failingFn, false))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBe(error)
  })

  it('keeps previous result when a call fails', async () => {
    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('First')
      .mockRejectedValueOnce(new Error('Boom'))

    const { result } = renderHook(() => useAsync<string>(asyncFn, false))

    await act(async () => {
      await result.current.execute() // success
    })

    expect(result.current.result).toBe('First')
    expect(result.current.error).toBeNull()

    await act(async () => {
      await result.current.execute() // failure
    })

    expect(result.current.result).toBe('First')
    expect(result.current.error).toEqual(new Error('Boom'))
  })

  it('returns a stable execute reference between renders', () => {
    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockResolvedValue('ok')

    const { result, rerender } = renderHook(() =>
      useAsync(asyncFn, false),
    )

    const execute1 = result.current.execute
    rerender()
    const execute2 = result.current.execute

    expect(execute2).toBe(execute1)
  })

  it('ignores results from outdated async calls when multiple are in flight', async () => {
    let resolveFirst: (value: string) => void
    let resolveSecond: (value: string) => void

    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve
    })
    const secondPromise = new Promise<string>((resolve) => {
      resolveSecond = resolve
    })

    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise)

    const { result } = renderHook(() => useAsync<string>(asyncFn, false))

    await act(async () => {
      void result.current.execute() // call 1
      void result.current.execute() // call 2
    })

    // Resolve the second call first, then the first call.
    // With "last call wins" semantics, final result should be "second".
    await act(async () => {
      resolveSecond!('second')
      resolveFirst!('first')
      await Promise.all(
        asyncFn.mock.results.map(async r => r.value as Promise<string>),
      )
    })

    expect(result.current.result).toBe('second')
  })

  it('does not update state after unmount', async () => {
    let resolveFn: (value: string) => void
    const promise = new Promise<string>((resolve) => {
      resolveFn = resolve
    })

    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockReturnValue(promise)

    const { result, unmount } = renderHook(() =>
      useAsync<string>(asyncFn, false),
    )

    await act(async () => {
      void result.current.execute()
    })

    unmount()

    await act(async () => {
      resolveFn!('value after unmount')
      await promise
    })

    // After unmount, the hook should not update state anymore.
    // We still have access to the last snapshot via result.current,
    // which should remain the initial value.
    expect(result.current.result).toBeNull()
  })

  it('ignores errors from outdated async calls when multiple are in flight', async () => {
    let rejectFirst: (reason?: unknown) => void
    let resolveSecond: (value: string) => void

    const firstPromise = new Promise<string>((_, reject) => {
      rejectFirst = reject
    })
    const secondPromise = new Promise<string>((resolve) => {
      resolveSecond = resolve
    })

    const asyncFn = vi
      .fn<() => Promise<string>>()
      .mockReturnValueOnce(firstPromise) // first call → will reject
      .mockReturnValueOnce(secondPromise) // second call → will resolve

    const { result } = renderHook(() => useAsync<string>(asyncFn, false))

    // Fire two calls; second one should be considered the "current" one.
    await act(async () => {
      void result.current.execute() // call 1
      void result.current.execute() // call 2
    })

    // Resolve the second (current) call, then reject the first (outdated) one.
    await act(async () => {
      resolveSecond!('second')
      rejectFirst!(new Error('first failed'))
    })

    // Wait until the hook has processed the successful second call.
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.result).toBe('second')
    })

    // The error from the outdated first call should be ignored.
    expect(result.current.error).toBeNull()
  })
})
