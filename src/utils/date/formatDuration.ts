export type DurationUnit
  = | 'millisecond'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'

/**
 * Optional label overrides for {@link formatDuration}.
 *
 * You can customize singular and plural labels independently.
 *
 * For example:
 * - English abbreviations: `"h"`, `"min"`, `"s"`
 * - Localized labels: `"小时"`, `"分钟"` ...
 */
export interface FormatDurationLabels {
  millisecond?: string
  millisecondPlural?: string
  second?: string
  secondPlural?: string
  minute?: string
  minutePlural?: string
  hour?: string
  hourPlural?: string
  day?: string
  dayPlural?: string
}

/**
 * Options for {@link formatDuration}.
 */
export interface FormatDurationOptions {
  /**
   * Unit of the `duration` argument.
   *
   * - `"milliseconds"` (default) — `duration` is the number of milliseconds.
   * - `"seconds"` — `duration` is the number of seconds.
   */
  inputUnit?: 'milliseconds' | 'seconds'

  /**
   * Smallest time unit to include in the formatted string.
   *
   * Units smaller than this are **discarded** (truncated, not rounded).
   *
   * Examples:
   * - `minUnit: 'second'` + 1500 ms → `"1 second"` (milliseconds dropped)
   * - `minUnit: 'minute'` + 90 seconds → `"1 minute"` (seconds dropped)
   *
   * Defaults to `"second"`.
   */
  minUnit?: DurationUnit

  /**
   * Largest time unit to include in the formatted string.
   *
   * Units larger than this are not used. For example, if you set
   * `maxUnit: 'hour'`, days will be converted to hours.
   *
   * Defaults to `"day"`.
   */
  maxUnit?: DurationUnit

  /**
   * Whether to include units with a value of `0`.
   *
   * - When `false` (default): `"1 hour 0 minutes"` → `"1 hour"`.
   * - When `true`: `"1 hour 0 minutes"`.
   */
  includeZeroUnits?: boolean

  /**
   * Whether to only display the **single largest** non-zero unit.
   *
   * - `false` (default): `90_000 ms` → `"1 minute 30 seconds"`
   * - `true`: `90_000 ms` → `"1 minute"`
   *
   * Note: If the duration is exactly `0`, this still returns
   * `"0 <minUnit>"` (e.g. `"0 seconds"`).
   */
  largestUnitOnly?: boolean

  /**
   * String used to join each segment in the final result.
   *
   * Example: `"1 hour, 5 minutes"` → `separator: ', '`.
   *
   * Default: `' '` (single space).
   */
  separator?: string

  /**
   * Custom label overrides for each unit.
   *
   * For example:
   * ```ts
   * formatDuration(90_000, {
   *   labels: {
   *     minute: 'min',
   *     minutePlural: 'min',
   *     second: 's',
   *     secondPlural: 's',
   *   },
   * });
   * // → "1 min 30 s"
   * ```
   */
  labels?: FormatDurationLabels

  /**
   * Custom formatter for each `(unit, value)` pair.
   *
   * When provided, this takes precedence over `labels`.
   *
   * Example:
   * ```ts
   * formatDuration(90_000, {
   *   formatUnit: (unit, value) => {
   *     const short = { minute: 'm', second: 's' } as const;
   *     return `${value}${short[unit] ?? unit}`;
   *   },
   * });
   * // → "1m 30s"
   * ```
   */
  formatUnit?: (unit: DurationUnit, value: number) => string

  /**
   * How to display the sign for negative durations.
   *
   * - `"auto"` (default): `'-'` for negative, nothing for positive/zero.
   * - `"always"`: `'+'` for positive, `'-'` for negative.
   * - `"never"`: always omit sign (absolute value).
   */
  signDisplay?: 'auto' | 'always' | 'never'
}

const UNIT_ORDER: DurationUnit[] = [
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
]

const UNIT_MS: Record<DurationUnit, number> = {
  millisecond: 1,
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
} as const

const DEFAULT_LABELS: Required<FormatDurationLabels> = {
  millisecond: 'millisecond',
  millisecondPlural: 'milliseconds',
  second: 'second',
  secondPlural: 'seconds',
  minute: 'minute',
  minutePlural: 'minutes',
  hour: 'hour',
  hourPlural: 'hours',
  day: 'day',
  dayPlural: 'days',
}

/**
 * Format a time duration (e.g. milliseconds or seconds) into a
 * human-readable string.
 *
 * The function is intentionally flexible and dependency-free:
 *
 * - Supports input in `"milliseconds"` or `"seconds"`.
 * - Configurable minimum / maximum units (`minUnit`, `maxUnit`).
 * - Can show all units (`"1 hour 30 minutes"`) or only the largest unit
 *   (`"1 hour"`).
 * - Allows zero-valued units when desired (`includeZeroUnits`).
 * - Supports label overrides and even full unit formatting via
 *   `formatUnit`.
 * - Optional sign control for negative durations.
 *
 * @param {number} duration
 *   The duration value, interpreted according to `options.inputUnit`
 *   (default `"milliseconds"`).
 *
 * @param {FormatDurationOptions} [options]
 *   Additional formatting configuration.
 *
 * @returns {string}
 *   A human-readable representation of the duration, such as:
 *   - `"42 seconds"`
 *   - `"1 minute 30 seconds"`
 *   - `"2 hours"`
 *   - `"1h 5m"` (with appropriate `formatUnit` overrides)
 *
 * @throws {RangeError}
 *   When `duration` is not a finite number.
 *
 * @example
 * ```ts
 * formatDuration(90_000); // "1 minute 30 seconds"
 * formatDuration(5_000, { inputUnit: 'seconds' }); // "1 hour 23 minutes 20 seconds"
 * ```
 *
 * @example
 * ```ts
 * // Only show the largest unit:
 * formatDuration(90_000, { largestUnitOnly: true }); // "1 minute"
 * ```
 *
 * @example
 * ```ts
 * // Use abbreviated labels:
 * formatDuration(90_000, {
 *   labels: {
 *     minute: 'min',
 *     minutePlural: 'min',
 *     second: 's',
 *     secondPlural: 's',
 *   },
 * });
 * // → "1 min 30 s"
 * ```
 *
 * @example
 * ```ts
 * // Fully custom unit formatting:
 * formatDuration(90_000, {
 *   formatUnit: (unit, value) => {
 *     const short = { hour: 'h', minute: 'm', second: 's' } as const;
 *     return `${value}${short[unit] ?? unit}`;
 *   },
 * });
 * // → "1m 30s"
 * ```
 */
export const formatDuration = (
  duration: number,
  options: FormatDurationOptions = {},
): string => {
  const {
    inputUnit = 'milliseconds',
    minUnit = 'second',
    maxUnit = 'day',
    includeZeroUnits = false,
    largestUnitOnly = false,
    separator = ' ',
    labels,
    formatUnit,
    signDisplay = 'auto',
  } = options

  if (typeof duration !== 'number' || !Number.isFinite(duration)) {
    throw new RangeError('formatDuration: "duration" must be a finite number')
  }

  const mergedLabels: Required<FormatDurationLabels> = {
    ...DEFAULT_LABELS,
    ...labels,
  }

  const toMs = (value: number): number => {
    return inputUnit === 'seconds' ? value * 1000 : value
  }

  const totalMs = toMs(duration)
  const isNegative = totalMs < 0
  let remainingMs = Math.abs(totalMs)

  const signPrefix
    = signDisplay === 'never'
      ? ''
      : signDisplay === 'always'
        ? isNegative
          ? '-'
          : '+'
        : isNegative
          ? '-'
          : ''

  const minIdx = UNIT_ORDER.indexOf(minUnit)
  const maxIdx = UNIT_ORDER.indexOf(maxUnit)

  const startIdx = Math.min(minIdx, maxIdx)
  const endIdx = Math.max(minIdx, maxIdx)

  interface Part {
    unit: DurationUnit
    value: number
  }

  const parts: Part[] = []

  for (let i = startIdx; i <= endIdx; i++) {
    const unit = UNIT_ORDER[i]
    const unitMs = UNIT_MS[unit]

    /* v8 ignore next @preserve */
    if (unitMs <= 0) {
      continue
    }

    const value = Math.floor(remainingMs / unitMs)

    if (!includeZeroUnits && value === 0) {
      continue
    }

    parts.push({ unit, value })

    remainingMs -= value * unitMs

    if (largestUnitOnly && value > 0) {
      break
    }
  }

  const formatUnitDefault = (unit: DurationUnit, value: number): string => {
    const singularKey = unit as keyof FormatDurationLabels
    const pluralKey = `${unit}Plural` as keyof FormatDurationLabels

    const isPlural = value !== 1
    const label = isPlural
      ? mergedLabels[pluralKey] ?? mergedLabels[singularKey] ?? unit
      : mergedLabels[singularKey] ?? unit

    return `${value} ${label}`
  }

  const formatPart = (part: Part): string =>
    formatUnit ? formatUnit(part.unit, part.value) : formatUnitDefault(part.unit, part.value)

  if (parts.length === 0) {
    // Either duration is exactly 0, or everything was truncated
    // (e.g. minUnit: 'minute' & duration < 1 minute).
    /* v8 ignore next @preserve */
    const fallbackUnit = UNIT_ORDER[endIdx] ?? minUnit
    const fallbackValue = 0
    const fallbackPart: Part = { unit: fallbackUnit, value: fallbackValue }

    return signPrefix + formatPart(fallbackPart)
  }

  const body = parts.map(formatPart).join(separator)
  return signPrefix + body
}
