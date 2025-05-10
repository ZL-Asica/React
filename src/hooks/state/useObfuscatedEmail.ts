import { useState } from 'react'
import { useAdaptiveEffect } from '../dom'

/**
 * A React hook that safely obfuscates an email address to prevent spam bots
 * from detecting it in the source HTML or static JavaScript.
 *
 * The hook splits and reconstructs the email using JavaScript at runtime,
 * so the full email will not appear in static markup or SSR output.
 *
 * @param rawEmail - The raw email address in the format `user@domain.com`
 * @returns An object containing:
 *   - `href`: A `mailto:` link that can be used in anchor tags
 *   - `text`: The full obfuscated email address for display
 *
 * @example
 * ```tsx
 * const { href, text } = useObfuscatedEmail('email@example.com')
 *
 * return (
 *   <a href={href} title={text}>
 *     {text}
 *   </a>
 * )
 * ```
 *
 * @example
 * ```tsx
 * const { text } = useObfuscatedEmail('hello@example.com')
 *
 * return (
 *   <span>{text}</span> // Text-only display (not clickable)
 * )
 * ```
 */
export const useObfuscatedEmail = (
  rawEmail: string,
): { href: string | null, text: string | null } => {
  const [email, setEmail] = useState<{ href: string | null, text: string | null }>({
    href: null,
    text: null,
  })

  useAdaptiveEffect(() => {
    const [user, domain] = rawEmail.split('@')
    if (!user || !domain) {
      return
    }

    const at = String.fromCharCode(64)
    const full = `${user}${at}${domain}`

    setEmail({
      href: `mailto:${full}`,
      text: full,
    })
  }, [rawEmail])

  return email
}
