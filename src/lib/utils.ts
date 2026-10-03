export function formatPrice(price: number | null, isFree: boolean): string {
  if (isFree) return 'Free';
  if (price === null) return 'Price on request';
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPhone(phone: string): string {
  // Format as +91 XXXXX XXXXX
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}
