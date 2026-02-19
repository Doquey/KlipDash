/**
 * Format a UTC ISO string as a human-readable time in the given timezone.
 * Example: "9:00 AM"
 */
export function formatTimeSlot(isoString: string, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(new Date(isoString))
}

/**
 * Format a date as "Mon Jan 6" style label.
 */
export function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format a date as short weekday + day number for the horizontal date picker.
 * Example: { weekday: "Mon", day: "19" }
 */
export function formatDatePickerDay(date: Date): { weekday: string; day: string } {
  return {
    weekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
    day: String(date.getDate()),
  }
}

/**
 * Returns the next N days starting from today.
 */
export function getNextNDays(n = 14): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d
  })
}

/**
 * Converts a Date to a YYYY-MM-DD string (local date, not UTC).
 */
export function toISODateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns true if two dates are the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
