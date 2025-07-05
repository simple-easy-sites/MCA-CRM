export function formatCurrencyAbbreviated(amount: number): { abbreviated: string; full: string } {
  const fullFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  let abbreviated: string

  if (amount >= 1000000) {
    abbreviated = `$${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}M`
  } else if (amount >= 1000) {
    abbreviated = `$${(amount / 1000).toFixed(0)}K`
  } else {
    abbreviated = fullFormatted
  }

  return {
    abbreviated,
    full: fullFormatted,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Format as (XXX) XXX-XXXX if it's a 10-digit US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  // Return original if not a standard format
  return phone
}
