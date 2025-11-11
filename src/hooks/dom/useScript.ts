import { useEffect, useState } from 'react'

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface UseScriptOptions {
  /**
   * Whether the script should be loaded asynchronously.
   * Defaults to `true` when not provided.
   */
  async?: boolean

  /**
   * Whether to set the `defer` attribute on the script element.
   * If omitted, `defer` is left untouched and the browser default applies.
   */
  defer?: boolean
}

/**
 * Normalize the string value from a `<script>` `data-status` attribute
 * into a strongly typed {@link ScriptStatus}.
 *
 * Any unknown or missing values are treated as `'idle'`.
 *
 * @param {string | null} value - Raw `data-status` attribute value.
 * @returns {ScriptStatus} A normalized script status.
 *
 * @internal
 */
export const __INTERNAL__normalizeScriptStatus = (
  value: string | null,
): ScriptStatus => {
  if (value === 'loading' || value === 'ready' || value === 'error') {
    return value
  }

  return 'idle'
}

/**
 * Compute the initial script status for a given `src` in a DOM-safe way.
 *
 * Rules:
 * - When `src` is `null` → `'idle'` (hook is effectively disabled).
 * - When running in a non-DOM environment (no `window` or `document`) → `'idle'`.
 * - When there is no `<script src="...">` element yet → `'loading'`
 *   (because the effect will create it).
 * - When a `<script src="...">` already exists:
 *   - If it has a meaningful `data-status` (`'loading' | 'ready' | 'error'`)
 *     → return that.
 *   - Otherwise → treat it as `'loading'`.
 *
 * @param {string | null} src - Script URL, or `null` when disabled.
 * @returns {ScriptStatus} The inferred initial script status.
 *
 * @internal
 */
export const __INTERNAL__getInitialScriptStatus = (
  src: string | null,
): ScriptStatus => {
  if (src === null) {
    return 'idle'
  }

  /* v8 ignore if @preserve */
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    // SSR / non-DOM: do not touch globals, report idle
    return 'idle'
  }

  const script = document.querySelector<HTMLScriptElement>(
    `script[src="${src}"]`,
  )

  if (!script) {
    // We know the effect will create this script element,
    // so from the hook user's perspective it is already "loading".
    return 'loading'
  }

  const normalized = __INTERNAL__normalizeScriptStatus(
    script.getAttribute('data-status'),
  )

  // Existing script without a meaningful status is treated as in-flight.
  return normalized === 'idle' ? 'loading' : normalized
}

/**
 * React hook to dynamically load an external `<script>` tag and track its status.
 *
 * It:
 * - Reuses an existing `<script src="...">` element if one is already present.
 * - Tracks a {@link ScriptStatus} value: `'idle' | 'loading' | 'ready' | 'error'`.
 * - Exposes convenience booleans `ready` and `error`.
 * - Is safe to call during SSR (no DOM access on the server).
 *
 * When `src` is `null`, the hook:
 * - Does not create or modify any `<script>` element.
 * - Always reports an effective status of `'idle'`.
 *
 * @param {string | null} src
 *   URL of the script to load. Use `null` to disable the hook.
 *
 * @param {UseScriptOptions} [options]
 *   Optional script tag attributes:
 *   - `async` — Sets `script.async` (default: `true`).
 *   - `defer` — Sets `script.defer` when provided.
 *
 * @returns {{
 *   status: ScriptStatus;
 *   ready: boolean;
 *   error: boolean;
 * }} An object describing the current load state:
 *   - `status`: One of `'idle' | 'loading' | 'ready' | 'error'`.
 *   - `ready`: `true` when `status === 'ready'`.
 *   - `error`: `true` when `status === 'error'`.
 *
 * @example
 * ```tsx
 * const { status, ready, error } = useScript('https://example.com/sdk.js');
 *
 * if (error) {
 *   return <p>Failed to load SDK.</p>;
 * }
 *
 * if (!ready) {
 *   return <p>Loading SDK…</p>;
 * }
 *
 * return <RealComponentUsingSDK />;
 * ```
 *
 * @example
 * ```tsx
 * const enabled = useFeatureFlag('third-party-sdk');
 * const src = enabled ? 'https://example.com/sdk.js' : null;
 *
 * const { ready } = useScript(src, { async: true, defer: true });
 * ```
 */
export const useScript = (
  src: string | null,
  options: UseScriptOptions = {},
): {
  status: ScriptStatus
  ready: boolean
  error: boolean
} => {
  // Use a lazy initializer so that initial status can be derived from the
  // current DOM (if any) without running an effect.
  const [status, setStatus] = useState<ScriptStatus>(() =>
    __INTERNAL__getInitialScriptStatus(src),
  )

  // Normalize options so the effect does not depend on the object identity.
  const { async: asyncAttr = true, defer } = options

  useEffect(() => {
    // Non-DOM environments: skip DOM work entirely
    /* v8 ignore if @preserve */
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return
    }

    // When src is null, the hook is effectively disabled.
    // We don't create or touch any script element here.
    if (src === null) {
      return
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )

    // 1) Create the script if it does not yet exist
    if (!script) {
      script = document.createElement('script')
      script.src = src
      script.async = asyncAttr

      if (defer !== undefined) {
        script.defer = defer
      }

      script.setAttribute('data-status', 'loading')
      document.body.appendChild(script)
    }
    // 2) If a script exists but has no status, mark it as loading
    else if (script.getAttribute('data-status') === null) {
      script.setAttribute('data-status', 'loading')
    }

    const setFromEvent = (event: Event): void => {
      const newStatus: ScriptStatus
        = event.type === 'load' ? 'ready' : 'error'

      script.setAttribute('data-status', newStatus)
      setStatus(newStatus)
    }

    script.addEventListener('load', setFromEvent)
    script.addEventListener('error', setFromEvent)

    return () => {
      script?.removeEventListener('load', setFromEvent)
      script?.removeEventListener('error', setFromEvent)
    }
  }, [src, asyncAttr, defer])

  // When src is null, surface a stable "idle" state regardless of whatever
  // status might have been stored previously.
  const effectiveStatus: ScriptStatus = src === null ? 'idle' : status

  return {
    status: effectiveStatus,
    ready: effectiveStatus === 'ready',
    error: effectiveStatus === 'error',
  }
}
