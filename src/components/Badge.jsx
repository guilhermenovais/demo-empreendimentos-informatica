const styles = {
  disponivel: 'bg-green-100 text-green-800',
  esgotado: 'bg-gray-200 text-gray-600',
  doado: 'bg-blue-100 text-blue-800',
  reservado: 'bg-amber-100 text-amber-800',
  confirmada: 'bg-green-100 text-green-800',
}

const labels = {
  disponivel: 'Disponível',
  esgotado: 'Esgotado',
  doado: 'Doado',
  reservado: 'Reservado',
  confirmada: 'Confirmada',
}

export default function Badge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}
