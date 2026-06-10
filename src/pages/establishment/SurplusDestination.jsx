import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Badge from '../../components/Badge'
import { average, formatCurrency, formatDateTime } from '../../utils/format'

function SurplusForm({ product, suggestedQty, planDate, donationPartners, onPublish }) {
  const [destinationType, setDestinationType] = useState('venda')
  const [quantity, setQuantity] = useState(Math.max(suggestedQty, 1))
  const [discountPercent, setDiscountPercent] = useState(40)
  const [partnerId, setPartnerId] = useState(donationPartners[0]?.id ?? '')
  const [expiresAt, setExpiresAt] = useState(`${planDate}T21:00`)

  const discountedPrice = Number(
    (product.salePrice * (1 - discountPercent / 100)).toFixed(2)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (quantity <= 0) return

    onPublish({
      establishmentId: product.establishmentId,
      productId: product.id,
      quantity: Number(quantity),
      originalPrice: product.salePrice,
      discountedPrice: destinationType === 'venda' ? discountedPrice : 0,
      destinationType,
      donationPartner: destinationType === 'doacao' ? partnerId : null,
      expiresAt,
    })

    setQuantity(0)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 items-end gap-3 border-t border-gray-100 px-4 py-4 sm:grid-cols-6"
    >
      <div className="sm:col-span-2">
        <p className="font-medium text-gray-900">{product.name}</p>
        {suggestedQty > 0 && (
          <p className="text-xs text-amber-700">
            Sobra estimada hoje: {suggestedQty} un
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
        Quantidade
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
        Destinação
        <select
          value={destinationType}
          onChange={(e) => setDestinationType(e.target.value)}
          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="venda">Vender com desconto</option>
          <option value="doacao">Doar</option>
        </select>
      </label>

      {destinationType === 'venda' ? (
        <>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
            Desconto
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-sm text-gray-500">
                % &rarr; {formatCurrency(discountedPrice)}
              </span>
            </div>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
            Disponível até
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
        </>
      ) : (
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-600 sm:col-span-2">
          Parceiro de doação
          <select
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            {donationPartners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <button
        type="submit"
        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        {destinationType === 'venda' ? 'Publicar oferta' : 'Registrar doação'}
      </button>
    </form>
  )
}

export default function SurplusDestination() {
  const {
    session,
    products,
    productionPlans,
    surplusListings,
    donationPartners,
    createSurplusListing,
  } = useApp()

  const plan = productionPlans.find((p) => p.establishmentId === session.establishmentId)
  const establishmentProducts = products.filter(
    (p) => p.establishmentId === session.establishmentId
  )
  const establishmentListings = surplusListings.filter(
    (l) => l.establishmentId === session.establishmentId
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Destinação de Sobras</h1>
      <p className="mt-1 text-sm text-gray-500">
        Dê um destino para os itens que sobrarem hoje: venda com desconto para o consumidor
        final ou doação para parceiros sociais.
      </p>

      <h2 className="mt-6 text-lg font-semibold text-gray-900">Cadastrar sobra do dia</h2>
      <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {establishmentProducts.map((product) => {
          const item = plan?.items.find((i) => i.productId === product.id)
          const suggestedQty = item
            ? Math.max(item.estimatedQty - Math.round(average(item.soldQtyHistory)), 0)
            : 0

          return (
            <SurplusForm
              key={product.id}
              product={product}
              suggestedQty={suggestedQty}
              planDate={plan?.date ?? new Date().toISOString().slice(0, 10)}
              donationPartners={donationPartners}
              onPublish={createSurplusListing}
            />
          )
        })}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-gray-900">Sobras destinadas hoje</h2>
      <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Quantidade</th>
              <th className="px-4 py-3">Destinação</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Disponível até</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {establishmentListings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Nenhuma sobra cadastrada ainda.
                </td>
              </tr>
            )}
            {establishmentListings.map((listing) => {
              const product = products.find((p) => p.id === listing.productId)
              const partner = donationPartners.find((p) => p.id === listing.donationPartner)

              return (
                <tr key={listing.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{product?.name}</td>
                  <td className="px-4 py-3">{listing.quantity} un</td>
                  <td className="px-4 py-3 text-gray-600">
                    {listing.destinationType === 'venda'
                      ? 'Venda com desconto'
                      : `Doação · ${partner?.name ?? '-'}`}
                  </td>
                  <td className="px-4 py-3">
                    {listing.destinationType === 'venda' ? (
                      <span>
                        <span className="text-gray-400 line-through">
                          {formatCurrency(listing.originalPrice)}
                        </span>{' '}
                        <span className="font-medium text-emerald-700">
                          {formatCurrency(listing.discountedPrice)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDateTime(listing.expiresAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={listing.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
