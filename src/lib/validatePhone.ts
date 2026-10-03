// Basic Indian mobile number validation shared across client forms and API
// routes. Accepts optional +91/91 prefix and strips spaces/dashes before
// checking it's a 10-digit number starting with 6-9 (valid Indian mobile range).

export function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export function isValidPhone(raw: string): boolean {
  const digits = normalizePhone(raw);
  return /^[6-9][0-9]{9}$/.test(digits);
}
