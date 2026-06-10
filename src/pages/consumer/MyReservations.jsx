import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'
import { PAYMENT_METHODS, PLATFORM_FEE_PERCENT } from '../../config'
import { formatCurrency, formatDateTime } from '../../utils/format'

export default function MyReservations() {
  const { reservations, surplusListings, products, establishments, session } = useApp()

  const myReservations = reservations
    .filter((r) => r.consumerName === session.consumerName)
    .sort((a, b) => new Date(b.reservedAt) - new Date(a.reservedAt))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Minhas Reservas</h1>
      <p className="mt-1 text-sm text-gray-500">
        Histórico de excedentes reservados por você. Apresente esta tela no estabelecimento
        no momento da retirada.
      </p>

      {myReservations.length === 0 ? (
        <p className="mt-8 text-gray-500">Você ainda não fez nenhuma reserva.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Estabelecimento</th>
                <th className="px-4 py-3">Quantidade</th>
                <th className="px-4 py-3">Pagamento</th>
                <th className="px-4 py-3">Resumo do valor</th>
                <th className="px-4 py-3">Reservado em</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myReservations.map((reservation) => {
                const listing = surplusListings.find((l) => l.id === reservation.listingId)
                const product = products.find((p) => p.id === listing?.productId)
                const establishment = establishments.find(
                  (e) => e.id === listing?.establishmentId
                )
                const subtotal =
                  reservation.subtotal ?? reservation.unitPrice * reservation.quantity
                const feePercent = reservation.serviceFeePercent ?? PLATFORM_FEE_PERCENT
                const serviceFee = reservation.serviceFee ?? subtotal * (feePercent / 100)
                const total = reservation.total ?? subtotal + serviceFee
                const methodLabel = PAYMENT_METHODS.find(
                  (m) => m.id === reservation.paymentMethod
                )?.label

                return (
                  <tr key={reservation.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{product?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{establishment?.name}</td>
                    <td className="px-4 py-3">{reservation.quantity} un</td>
                    <td className="px-4 py-3 text-gray-600">{methodLabel ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>
                        Subtotal: {formatCurrency(subtotal)}
                      </div>
                      <div>
                        Taxa de serviço ({feePercent}%): {formatCurrency(serviceFee)}
                      </div>
                      <div className="font-semibold text-gray-900">
                        Total: {formatCurrency(total)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDateTime(reservation.reservedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={reservation.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
