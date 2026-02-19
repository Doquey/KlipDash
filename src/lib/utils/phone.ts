/**
 * Format a raw digit string as a US phone number: (555) 555-5555
 */
export function formatUSPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Returns true if the string looks like a valid 10-digit US phone number.
 */
export function isValidUSPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10
}

/**
 * Strip a formatted phone string down to digits only.
 */
export function stripPhone(value: string): string {
  return value.replace(/\D/g, '')
}
