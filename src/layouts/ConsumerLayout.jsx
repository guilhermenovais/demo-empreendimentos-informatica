import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/consumidor/ofertas', label: 'Ofertas' },
  { to: '/consumidor/reservas', label: 'Minhas Reservas' },
]

export default function ConsumerLayout() {
  const { session } = useApp()

  if (!session.consumerName) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-emerald-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-bold">AproveitaFood</p>
            <p className="text-xs text-emerald-200">Olá, {session.consumerName}</p>
          </div>
          <nav className="flex items-center gap-2">
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
            <NavLink
              to="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-800"
            >
              Trocar perfil
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
