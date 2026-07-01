export function formatPrice(amount: number): string {
  return `฿${amount.toLocaleString('en-US')}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
