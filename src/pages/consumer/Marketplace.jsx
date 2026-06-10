import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import CheckoutModal from '../../components/CheckoutModal'
import { formatCurrency, formatDateTime } from '../../utils/format'

function OfferCard({ listing, product, establishment, onSelect }) {
  const [quantity, setQuantity] = useState(1)

  const discountPercent = Math.round(
    (1 - listing.discountedPrice / listing.originalPrice) * 100
  )

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            {establishment?.name}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">{product?.name}</h3>
        </div>
        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
          -{discountPercent}%
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-gray-400 line-through">
          {formatCurrency(listing.originalPrice)}
        </span>
        <span className="text-2xl font-bold text-emerald-700">
          {formatCurrency(listing.discountedPrice)}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {listing.quantity} unidade(s) disponível(is) · retirar até{' '}
        {formatDateTime(listing.expiresAt)}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {Array.from({ length: listing.quantity }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          onClick={() => onSelect(quantity)}
          className="flex-1 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Reservar
        </button>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const { surplusListings, products, establishments, session, createReservation } = useApp()
  const [feedback, setFeedback] = useState(null)
  const [checkoutItem, setCheckoutItem] = useState(null)

  const offers = surplusListings.filter(
    (l) => l.destinationType === 'venda' && l.status === 'disponivel' && l.quantity > 0
  )

  const handleConfirmPayment = (paymentMethod) => {
    const { listing, product, quantity } = checkoutItem
    createReservation(listing.id, session.consumerName, quantity, paymentMethod)
    setFeedback(
      `Reserva confirmada: ${quantity}x ${product?.name}. Acompanhe em "Minhas Reservas".`
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Ofertas perto de você</h1>
      <p className="mt-1 text-sm text-gray-500">
        Excedentes do dia de restaurantes e padarias parceiras, com desconto e prontos para
        retirada.
      </p>

      {feedback && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {feedback}
        </p>
      )}

      {offers.length === 0 ? (
        <p className="mt-8 text-gray-500">Nenhuma oferta disponível no momento.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((listing) => (
            <OfferCard
              key={listing.id}
              listing={listing}
              product={products.find((p) => p.id === listing.productId)}
              establishment={establishments.find((e) => e.id === listing.establishmentId)}
              onSelect={(quantity) =>
                setCheckoutItem({
                  listing,
                  quantity,
                  product: products.find((p) => p.id === listing.productId),
                  establishment: establishments.find((e) => e.id === listing.establishmentId),
                })
              }
            />
          ))}
        </div>
      )}

      {checkoutItem && (
        <CheckoutModal
          item={checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  )
}
