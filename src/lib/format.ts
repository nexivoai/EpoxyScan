const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatUsd(value: number): string {
  return usd.format(value)
}

export function formatPriceRange(low: number, high: number): string {
  return low === high ? formatUsd(low) : `${formatUsd(low)} - ${formatUsd(high)}`
}
