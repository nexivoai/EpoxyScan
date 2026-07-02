export function toE164(input: string): string | null {
  const trimmed = input.trim()
  const digits = trimmed.replace(/\D/g, '')

  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  if (trimmed.startsWith('+') && digits.length >= 11 && digits.length <= 15) return `+${digits}`

  return null
}
