import { useApp } from '../../context/AppContext'
import { average } from '../../utils/format'

function HistoryBars({ values }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex h-10 items-end gap-0.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-emerald-200"
          style={{ height: `${Math.max((v / max) * 100, 8)}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  )
}

export default function ProductionPlanning() {
  const { session, products, productionPlans, updateProductionEstimate } = useApp()

  const plan = productionPlans.find((p) => p.establishmentId === session.establishmentId)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Planejamento de Produção</h1>
      <p className="mt-1 text-sm text-gray-500">
        Compare a produção estimada para hoje com a sugestão calculada a partir do histórico
        de vendas dos últimos 7 dias. Isso ajuda a evitar tanto a falta quanto o excesso de
        produção.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Histórico de vendas (7 dias)</th>
              <th className="px-4 py-3">Sugestão (média)</th>
              <th className="px-4 py-3">Produção estimada hoje</th>
              <th className="px-4 py-3">Previsão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plan?.items.map((item) => {
              const product = products.find((p) => p.id === item.productId)
              const suggestion = Math.round(average(item.soldQtyHistory))
              const diff = item.estimatedQty - suggestion

              return (
                <tr key={item.productId}>
                  <td className="px-4 py-3 font-medium text-gray-900">{product?.name}</td>
                  <td className="px-4 py-3">
                    <HistoryBars values={item.soldQtyHistory} />
                  </td>
                  <td className="px-4 py-3 text-gray-700">{suggestion} un</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={item.estimatedQty}
                      onChange={(e) =>
                        updateProductionEstimate(
                          session.establishmentId,
                          item.productId,
                          Number(e.target.value)
                        )
                      }
                      className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {diff > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Possível sobra de {diff} un
                      </span>
                    ) : diff < 0 ? (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Possível falta de {Math.abs(diff)} un
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Alinhado à demanda
                      </span>
                    )}
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
