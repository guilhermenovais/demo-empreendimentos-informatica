import { useApp } from '../../context/AppContext'
import StatCard from '../../components/StatCard'
import { average, cmvPercent, formatCurrency } from '../../utils/format'

const CMV_ALERT_THRESHOLD = 35

export default function CMVControl() {
  const { session, products, updateProductPricing } = useApp()

  const establishmentProducts = products.filter(
    (p) => p.establishmentId === session.establishmentId
  )

  const avgCmv = average(
    establishmentProducts.map((p) => cmvPercent(p.costPerUnit, p.salePrice))
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Controle de CMV</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe o Custo de Mercadoria Vendida (CMV) de cada item. Ajuste o custo dos
        insumos ou o preço de venda e veja o impacto na margem em tempo real.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="CMV médio do estabelecimento"
          value={`${avgCmv.toFixed(1)}%`}
          hint={`Meta recomendada: até ${CMV_ALERT_THRESHOLD}%`}
          tone={avgCmv > CMV_ALERT_THRESHOLD ? 'warning' : 'good'}
        />
        <StatCard label="Itens cadastrados" value={establishmentProducts.length} />
        <StatCard
          label="Itens em alerta de CMV"
          value={
            establishmentProducts.filter(
              (p) => cmvPercent(p.costPerUnit, p.salePrice) > CMV_ALERT_THRESHOLD
            ).length
          }
          hint="CMV acima da meta"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Custo unitário</th>
              <th className="px-4 py-3">Preço de venda</th>
              <th className="px-4 py-3">CMV %</th>
              <th className="px-4 py-3">Margem</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {establishmentProducts.map((product) => {
              const cmv = cmvPercent(product.costPerUnit, product.salePrice)
              const margin = product.salePrice - product.costPerUnit
              const isAlert = cmv > CMV_ALERT_THRESHOLD

              return (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">R$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.costPerUnit}
                        onChange={(e) =>
                          updateProductPricing(product.id, {
                            costPerUnit: Number(e.target.value),
                          })
                        }
                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">R$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.salePrice}
                        onChange={(e) =>
                          updateProductPricing(product.id, {
                            salePrice: Number(e.target.value),
                          })
                        }
                        className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cmv.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(margin)}</td>
                  <td className="px-4 py-3">
                    {isAlert ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Atenção
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Saudável
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
