import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import StatCard from '../../components/StatCard'
import { average, cmvPercent, formatCurrency } from '../../utils/format'

export default function Dashboard() {
  const {
    session,
    establishments,
    products,
    productionPlans,
    surplusListings,
    reservations,
  } = useApp()

  const establishment = establishments.find((e) => e.id === session.establishmentId)
  const establishmentProducts = products.filter(
    (p) => p.establishmentId === session.establishmentId
  )
  const plan = productionPlans.find((p) => p.establishmentId === session.establishmentId)
  const establishmentListings = surplusListings.filter(
    (l) => l.establishmentId === session.establishmentId
  )
  const listingIds = new Set(establishmentListings.map((l) => l.id))

  const availableForSale = establishmentListings
    .filter((l) => l.destinationType === 'venda' && l.status !== 'doado')
    .reduce((sum, l) => sum + l.quantity, 0)

  const donatedUnits = establishmentListings
    .filter((l) => l.destinationType === 'doacao')
    .reduce((sum, l) => sum + l.quantity, 0)

  const revenueRecovered = reservations
    .filter((r) => listingIds.has(r.listingId))
    .reduce((sum, r) => sum + r.quantity * r.unitPrice, 0)

  const avgCmv = average(
    establishmentProducts.map((p) => cmvPercent(p.costPerUnit, p.salePrice))
  )

  const surplusAlerts = (plan?.items ?? [])
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      const suggestion = Math.round(average(item.soldQtyHistory))
      return { product, diff: item.estimatedQty - suggestion }
    })
    .filter((entry) => entry.diff > 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Olá, {establishment?.name}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Resumo do dia: produção planejada, custos e destino dos excedentes.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Itens disponíveis p/ venda"
          value={`${availableForSale} un`}
          hint="Excedentes ativos no marketplace"
          tone="info"
        />
        <StatCard
          label="Receita recuperada"
          value={formatCurrency(revenueRecovered)}
          hint="Vendas de excedentes reservadas"
          tone="good"
        />
        <StatCard
          label="Itens doados"
          value={`${donatedUnits} un`}
          hint="Encaminhados a parceiros sociais"
        />
        <StatCard
          label="CMV médio"
          value={`${avgCmv.toFixed(1)}%`}
          hint="Custo de Mercadoria Vendida"
          tone={avgCmv > 35 ? 'warning' : 'good'}
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Alertas de previsão de produção
          </h2>
          <Link
            to="/estabelecimento/producao"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Ver planejamento &rarr;
          </Link>
        </div>
        {surplusAlerts.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            Nenhum item com sobra prevista hoje. Produção alinhada à demanda histórica.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100">
            {surplusAlerts.map(({ product, diff }) => (
              <li key={product.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-700">{product.name}</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Possível sobra de {diff} un
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Link
            to="/estabelecimento/sobras"
            className="inline-block rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Destinar sobras agora
          </Link>
        </div>
      </div>
    </div>
  )
}
