import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/estabelecimento/dashboard', label: 'Dashboard' },
  { to: '/estabelecimento/producao', label: 'Planejamento de Produção' },
  { to: '/estabelecimento/cmv', label: 'Controle de CMV' },
  { to: '/estabelecimento/sobras', label: 'Destinação de Sobras' },
]

export default function EstablishmentLayout() {
  const { session, establishments } = useApp()

  if (!session.establishmentId) {
    return <Navigate to="/" replace />
  }

  const establishment = establishments.find((e) => e.id === session.establishmentId)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-emerald-900 text-white">
        <div className="px-6 py-5">
          <p className="text-lg font-bold">AproveitaFood</p>
          <p className="mt-1 text-xs text-emerald-200">{establishment?.name}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-100 hover:bg-emerald-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4">
          <NavLink
            to="/"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-800"
          >
            Trocar perfil
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
