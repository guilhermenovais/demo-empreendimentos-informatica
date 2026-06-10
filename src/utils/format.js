export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function average(values) {
  if (!values.length) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function formatDateTime(iso) {
  const date = new Date(iso)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function cmvPercent(costPerUnit, salePrice) {
  if (!salePrice) return 0
  return (costPerUnit / salePrice) * 100
}
