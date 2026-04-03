const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2
})

export const formatCurrency = (value) => currencyFormatter.format(Number(value || 0))

export const formatDate = (value) => {
  if (!value) return '--'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
}

export const formatRole = (role) => role?.[0]?.toUpperCase() + role?.slice(1)
