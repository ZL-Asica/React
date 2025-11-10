import { renderHook } from '@testing-library/react'
import { useObfuscatedEmail } from '@/hooks/state'

describe('useObfuscatedEmail', () => {
  it('returns correct href and text for valid email', async () => {
    const { result } = renderHook(() =>
      useObfuscatedEmail('hello@example.com'),
    )

    expect(result.current.href).toBe('mailto:hello@example.com')
    expect(result.current.text).toBe('hello@example.com')
  })

  it('returns null values for invalid email (missing "@")', async () => {
    const { result } = renderHook(() =>
      useObfuscatedEmail('invalid-email'),
    )

    expect(result.current.href).toBeNull()
    expect(result.current.text).toBeNull()
  })

  it('updates when rawEmail changes', async () => {
    const { result, rerender } = renderHook(
      ({ email }) => useObfuscatedEmail(email),
      {
        initialProps: { email: 'foo@bar.com' },
      },
    )

    expect(result.current.text).toBe('foo@bar.com')

    rerender({ email: 'new@domain.com' })

    expect(result.current.text).toBe('new@domain.com')
    expect(result.current.href).toBe('mailto:new@domain.com')
  })
})
