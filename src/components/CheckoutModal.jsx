import { useState } from 'react'
import Modal from './Modal'
import { PAYMENT_METHODS, PLATFORM_FEE_PERCENT } from '../config'
import { formatCurrency } from '../utils/format'

export default function CheckoutModal({ item, onClose, onConfirm }) {
  const { product, establishment, listing, quantity } = item
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [step, setStep] = useState('review')

  const subtotal = listing.discountedPrice * quantity
  const serviceFee = subtotal * (PLATFORM_FEE_PERCENT / 100)
  const total = subtotal + serviceFee

  const handleConfirm = () => {
    onConfirm(paymentMethod)
    setStep('success')
  }

  if (step === 'success') {
    const methodLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label
    return (
      <Modal title="Pagamento aprovado" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
            ✓
          </span>
          <p className="text-sm text-gray-700">
            Pagamento de <span className="font-semibold">{formatCurrency(total)}</span> via{' '}
            {methodLabel} aprovado.
          </p>
          <p className="text-xs text-gray-400">
            {quantity}x {product?.name} · {establishment?.name}
          </p>
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Concluir
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Finalizar reserva" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-medium text-gray-900">
            {quantity}x {product?.name}
          </p>
          <p className="text-sm text-gray-500">{establishment?.name}</p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Forma de pagamento</legend>
          <div className="mt-2 flex flex-col gap-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  paymentMethod === method.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="accent-emerald-700"
                />
                {method.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-gray-600">
            <span>Taxa de serviço AproveitaFood ({PLATFORM_FEE_PERCENT}%)</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
            <span>Total a pagar</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          A taxa de serviço remunera a plataforma AproveitaFood e é cobrada a cada reserva
          paga. Pagamento simulado para fins de demonstração.
        </p>

        <button
          onClick={handleConfirm}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Pagar {formatCurrency(total)}
        </button>
      </div>
    </Modal>
  )
}
