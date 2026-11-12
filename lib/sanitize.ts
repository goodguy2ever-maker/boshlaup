/**
 * Basic input sanitization and XSS prevention
 */
export function sanitizeText(input: unknown, maxLength = 5000): string {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .trim();
}

/**
 * Validate and clean URLs (only allow http/https)
 */
export function sanitizeUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
