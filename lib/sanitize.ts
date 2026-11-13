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
 * Validate and sanitize logo URL (allows clean http/https URLs or safe image data URLs up to 1.5MB)
 */
export function sanitizeLogoUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
    if (trimmed.length > 1500000) return null;
    return trimmed;
  }
  return sanitizeUrl(trimmed);
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
