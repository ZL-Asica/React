import { act, renderHook } from '@testing-library/react'
import {
  __INTERNAL__getInitialScriptStatus,
  __INTERNAL__normalizeScriptStatus,
  useScript,
} from '@/hooks/dom/useScript'

describe('__INTERNAL__normalizeScriptStatus', () => {
  it('returns known statuses as-is', () => {
    expect(__INTERNAL__normalizeScriptStatus('loading')).toBe('loading')
    expect(__INTERNAL__normalizeScriptStatus('ready')).toBe('ready')
    expect(__INTERNAL__normalizeScriptStatus('error')).toBe('error')
  })

  it('falls back to "idle" for unknown or null values', () => {
    expect(__INTERNAL__normalizeScriptStatus('something-else')).toBe('idle')
    expect(__INTERNAL__normalizeScriptStatus('')).toBe('idle')
    expect(__INTERNAL__normalizeScriptStatus(null)).toBe('idle')
  })
})

describe('__INTERNAL__getInitialScriptStatus', () => {
  afterEach(() => {
    document.body.querySelectorAll('script').forEach(node => node.remove())
  })

  it('returns "idle" when src is null', () => {
    expect(__INTERNAL__getInitialScriptStatus(null)).toBe('idle')
  })

  it('returns "loading" when no script exists yet', () => {
    const status = __INTERNAL__getInitialScriptStatus(
      'https://example.com/new-script.js',
    )
    expect(status).toBe<'loading'>('loading')
  })

  it('returns existing script status when data-status is set', () => {
    const src = 'https://example.com/existing.js'
    const script = document.createElement('script')
    script.src = src
    script.setAttribute('data-status', 'ready')
    document.body.appendChild(script)

    const status = __INTERNAL__getInitialScriptStatus(src)
    expect(status).toBe<'ready'>('ready')
  })

  it('treats existing script with idle/missing status as loading', () => {
    const src = 'https://example.com/idle.js'
    const script = document.createElement('script')
    script.src = src
    script.setAttribute('data-status', 'idle')
    document.body.appendChild(script)

    const status = __INTERNAL__getInitialScriptStatus(src)
    expect(status).toBe<'loading'>('loading')

    const srcNoStatus = 'https://example.com/no-status.js'
    const script2 = document.createElement('script')
    script2.src = srcNoStatus
    // no data-status set
    document.body.appendChild(script2)

    const status2 = __INTERNAL__getInitialScriptStatus(srcNoStatus)
    expect(status2).toBe<'loading'>('loading')
  })
})

describe('useScript', () => {
  const SRC_OK = 'https://example.com/ok.js'
  const SRC_ERROR = 'https://example.com/error.js'
  const SRC_REUSE = 'https://example.com/reuse.js'
  const SRC_TOGGLE = 'https://example.com/toggle.js'
  const SRC_OPTIONS = 'https://example.com/options.js'

  afterEach(() => {
    document.body.querySelectorAll('script').forEach(node => node.remove())
  })

  it('creates a script element and updates status to "ready" on load', () => {
    const { result } = renderHook(() => useScript(SRC_OK))

    // Initial state from __INTERNAL__getInitialScriptStatus: "loading"
    expect(result.current.status).toBe<'loading'>('loading')
    expect(result.current.ready).toBe(false)
    expect(result.current.error).toBe(false)

    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC_OK}"]`,
    )
    expect(script).not.toBeNull()
    expect(script?.getAttribute('data-status')).toBe('loading')

    act(() => {
      script?.dispatchEvent(new Event('load'))
    })

    expect(result.current.status).toBe<'ready'>('ready')
    expect(result.current.ready).toBe(true)
    expect(result.current.error).toBe(false)
    expect(script?.getAttribute('data-status')).toBe('ready')
  })

  it('updates status to "error" when the script fails to load', () => {
    const { result } = renderHook(() => useScript(SRC_ERROR))

    expect(result.current.status).toBe<'loading'>('loading')

    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC_ERROR}"]`,
    )
    expect(script).not.toBeNull()

    act(() => {
      script?.dispatchEvent(new Event('error'))
    })

    expect(result.current.status).toBe<'error'>('error')
    expect(result.current.ready).toBe(false)
    expect(result.current.error).toBe(true)
    expect(script?.getAttribute('data-status')).toBe('error')
  })

  it('reuses an existing script element and initializes status from it', () => {
    const src = SRC_REUSE

    // First hook instance: create script & move to ready
    const { result: firstResult, unmount: firstUnmount } = renderHook(() =>
      useScript(src),
    )

    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )
    expect(script).not.toBeNull()

    act(() => {
      script?.dispatchEvent(new Event('load'))
    })

    expect(firstResult.current.status).toBe<'ready'>('ready')
    firstUnmount()

    // Second hook instance: should see status "ready" immediately
    const { result: secondResult } = renderHook(() => useScript(src))

    expect(secondResult.current.status).toBe<'ready'>('ready')
    expect(secondResult.current.ready).toBe(true)
    expect(secondResult.current.error).toBe(false)
  })

  it('treats null src as disabled and always reports idle/false/false', () => {
    const { result, rerender } = renderHook(
      ({ scriptSrc }: { scriptSrc: string | null }) => useScript(scriptSrc),
      {
        initialProps: { scriptSrc: null },
      },
    )

    // With src = null: no script created, idle state
    expect(result.current.status).toBe<'idle'>('idle')
    expect(result.current.ready).toBe(false)
    expect(result.current.error).toBe(false)
    expect(
      document.querySelector<HTMLScriptElement>(`script[src="${SRC_TOGGLE}"]`),
    ).toBeNull()

    // Switch to a real src
    // @ts-expect-error: scriptSrc is string | null
    rerender({ scriptSrc: SRC_TOGGLE })

    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC_TOGGLE}"]`,
    )
    expect(script).not.toBeNull()

    act(() => {
      script?.dispatchEvent(new Event('load'))
    })

    expect(result.current.status).toBe<'ready'>('ready')
    expect(result.current.ready).toBe(true)
    expect(result.current.error).toBe(false)

    // Switch back to null: derived state should surface as idle again
    rerender({ scriptSrc: null })

    expect(result.current.status).toBe<'idle'>('idle')
    expect(result.current.ready).toBe(false)
    expect(result.current.error).toBe(false)
  })

  it('applies async and defer options on created script elements', () => {
    const { result } = renderHook(() =>
      useScript(SRC_OPTIONS, { async: false, defer: true }),
    )

    const script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC_OPTIONS}"]`,
    )
    expect(script).not.toBeNull()

    // async explicitly set to false
    expect(script?.async).toBe(false)
    // defer explicitly set to true
    expect(script?.defer).toBe(true)

    // Still behaves like a normal loading script
    expect(result.current.status).toBe<'loading'>('loading')

    act(() => {
      script?.dispatchEvent(new Event('load'))
    })

    expect(result.current.status).toBe<'ready'>('ready')
    expect(result.current.ready).toBe(true)
    expect(result.current.error).toBe(false)
  })

  it('marks existing script without data-status as loading', () => {
    const src = 'https://example.com/no-status-effect.js'

    // Pre-create a script without data-status
    const script = document.createElement('script')
    script.src = src
    // intentionally no script.setAttribute('data-status', ...)
    document.body.appendChild(script)

    // Now mount the hook: it should see the existing script, find no data-status,
    // and set it to "loading" via the branch we want to cover.
    const { result } = renderHook(() => useScript(src))

    const reused = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )

    expect(reused).not.toBeNull()
    expect(reused?.getAttribute('data-status')).toBe('loading')
    expect(result.current.status).toBe<'loading'>('loading')

    // Also confirm it can transition to "ready"
    act(() => {
      reused?.dispatchEvent(new Event('load'))
    })

    expect(reused?.getAttribute('data-status')).toBe('ready')
    expect(result.current.status).toBe<'ready'>('ready')
  })
})
