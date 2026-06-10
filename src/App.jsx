import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import EstablishmentLayout from './layouts/EstablishmentLayout'
import ConsumerLayout from './layouts/ConsumerLayout'
import RoleSelect from './pages/RoleSelect'
import Dashboard from './pages/establishment/Dashboard'
import ProductionPlanning from './pages/establishment/ProductionPlanning'
import CMVControl from './pages/establishment/CMVControl'
import SurplusDestination from './pages/establishment/SurplusDestination'
import Marketplace from './pages/consumer/Marketplace'
import MyReservations from './pages/consumer/MyReservations'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RoleSelect />} />

          <Route path="/estabelecimento" element={<EstablishmentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="producao" element={<ProductionPlanning />} />
            <Route path="cmv" element={<CMVControl />} />
            <Route path="sobras" element={<SurplusDestination />} />
          </Route>

          <Route path="/consumidor" element={<ConsumerLayout />}>
            <Route index element={<Navigate to="ofertas" replace />} />
            <Route path="ofertas" element={<Marketplace />} />
            <Route path="reservas" element={<MyReservations />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
