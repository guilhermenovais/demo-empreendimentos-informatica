import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function RoleSelect() {
  const { establishments, session, setCurrentEstablishment, setConsumerName } = useApp()
  const navigate = useNavigate()

  const [establishmentId, setEstablishmentId] = useState(
    session.establishmentId ?? establishments[0]?.id ?? ''
  )
  const [password, setPassword] = useState('')
  const [consumerNameInput, setConsumerNameInput] = useState(session.consumerName ?? '')

  const handleEstablishmentSubmit = (e) => {
    e.preventDefault()
    setCurrentEstablishment(establishmentId)
    navigate('/estabelecimento/dashboard')
  }

  const handleConsumerSubmit = (e) => {
    e.preventDefault()
    const name = consumerNameInput.trim() || 'Consumidor'
    setConsumerName(name)
    navigate('/consumidor/ofertas')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-emerald-900">AproveitaFood</h1>
        <p className="mt-2 max-w-xl text-gray-600">
          Plataforma de gestão e escoamento de excedentes alimentares para restaurantes e
          padarias. Planeje a produção, controle o CMV e dê um destino para as sobras do dia.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
        <form
          onSubmit={handleEstablishmentSubmit}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sou Estabelecimento</h2>
            <p className="mt-1 text-sm text-gray-500">
              Acesse o painel de gestão de produção, custos e excedentes.
            </p>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Selecione o estabelecimento
            <select
              value={establishmentId}
              onChange={(e) => setEstablishmentId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              {establishments.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="mt-auto rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Entrar no painel
          </button>
        </form>

        <form
          onSubmit={handleConsumerSubmit}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sou Consumidor</h2>
            <p className="mt-1 text-sm text-gray-500">
              Encontre ofertas de excedentes com desconto perto de você.
            </p>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Seu nome
            <input
              type="text"
              value={consumerNameInput}
              onChange={(e) => setConsumerNameInput(e.target.value)}
              placeholder="Como podemos te chamar?"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="mt-auto rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Ver ofertas
          </button>
        </form>
      </div>
    </div>
  )
}
