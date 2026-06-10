import { createContext, useContext, useEffect, useState } from 'react'
import { getInitialData } from '../data/seedData'
import { PLATFORM_FEE_PERCENT } from '../config'

const STORAGE_KEY = 'aproveitafood_data'
const SESSION_KEY = 'aproveitafood_session'

const AppContext = createContext(null)

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupted storage and fall back to seed data
  }
  return getInitialData()
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupted storage
  }
  return { establishmentId: null, consumerName: null }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData)
  const [session, setSession] = useState(loadSession)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  const setCurrentEstablishment = (establishmentId) => {
    setSession((s) => ({ ...s, establishmentId }))
  }

  const setConsumerName = (consumerName) => {
    setSession((s) => ({ ...s, consumerName }))
  }

  const updateProductionEstimate = (establishmentId, productId, estimatedQty) => {
    setData((prev) => ({
      ...prev,
      productionPlans: prev.productionPlans.map((plan) =>
        plan.establishmentId !== establishmentId
          ? plan
          : {
              ...plan,
              items: plan.items.map((item) =>
                item.productId !== productId ? item : { ...item, estimatedQty }
              ),
            }
      ),
    }))
  }

  const updateProductPricing = (productId, { costPerUnit, salePrice }) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id !== productId
          ? product
          : {
              ...product,
              ...(costPerUnit !== undefined ? { costPerUnit } : {}),
              ...(salePrice !== undefined ? { salePrice } : {}),
            }
      ),
    }))
  }

  const createSurplusListing = (listing) => {
    setData((prev) => ({
      ...prev,
      surplusListings: [
        ...prev.surplusListings,
        {
          id: `listing-${Date.now()}`,
          status: listing.destinationType === 'doacao' ? 'doado' : 'disponivel',
          ...listing,
        },
      ],
    }))
  }

  const createReservation = (listingId, consumerName, quantity, paymentMethod) => {
    setData((prev) => {
      const listing = prev.surplusListings.find((l) => l.id === listingId)
      if (!listing || listing.quantity < quantity) return prev

      const remaining = listing.quantity - quantity
      const subtotal = listing.discountedPrice * quantity
      const serviceFee = subtotal * (PLATFORM_FEE_PERCENT / 100)

      return {
        ...prev,
        surplusListings: prev.surplusListings.map((l) =>
          l.id !== listingId
            ? l
            : {
                ...l,
                quantity: remaining,
                status: remaining === 0 ? 'esgotado' : l.status,
              }
        ),
        reservations: [
          ...prev.reservations,
          {
            id: `reservation-${Date.now()}`,
            listingId,
            consumerName,
            quantity,
            unitPrice: listing.discountedPrice,
            paymentMethod,
            subtotal,
            serviceFeePercent: PLATFORM_FEE_PERCENT,
            serviceFee,
            total: subtotal + serviceFee,
            reservedAt: new Date().toISOString(),
            status: 'confirmada',
          },
        ],
      }
    })
  }

  const value = {
    ...data,
    session,
    setCurrentEstablishment,
    setConsumerName,
    updateProductionEstimate,
    updateProductPricing,
    createSurplusListing,
    createReservation,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
