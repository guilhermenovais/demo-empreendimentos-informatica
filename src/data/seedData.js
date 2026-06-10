export const TODAY = '2026-06-10'

export const establishments = [
  {
    id: 'est1',
    name: 'Padaria Pão Quente',
    type: 'padaria',
    address: 'Rua das Flores, 123 - Centro',
  },
  {
    id: 'est2',
    name: 'Restaurante Sabor Caseiro',
    type: 'restaurante',
    address: 'Av. Central, 456 - Centro',
  },
]

export const products = [
  // Padaria Pão Quente
  { id: 'p1', establishmentId: 'est1', name: 'Pão Francês (un)', category: 'Pães', costPerUnit: 0.35, salePrice: 0.75 },
  { id: 'p2', establishmentId: 'est1', name: 'Croissant', category: 'Padaria Fina', costPerUnit: 1.8, salePrice: 6.5 },
  { id: 'p3', establishmentId: 'est1', name: 'Bolo de Fubá (fatia)', category: 'Doces', costPerUnit: 1.2, salePrice: 5.0 },
  { id: 'p4', establishmentId: 'est1', name: 'Coxinha', category: 'Salgados', costPerUnit: 1.5, salePrice: 7.0 },
  // Restaurante Sabor Caseiro
  { id: 'p5', establishmentId: 'est2', name: 'Marmita Executiva', category: 'Pratos Prontos', costPerUnit: 8.0, salePrice: 22.0 },
  { id: 'p6', establishmentId: 'est2', name: 'Feijoada (porção)', category: 'Pratos Prontos', costPerUnit: 9.5, salePrice: 28.0 },
  { id: 'p7', establishmentId: 'est2', name: 'Salada Caesar', category: 'Saladas', costPerUnit: 4.5, salePrice: 18.0 },
  { id: 'p8', establishmentId: 'est2', name: 'Suco Natural (copo)', category: 'Bebidas', costPerUnit: 1.5, salePrice: 8.0 },
]

export const productionPlans = [
  {
    id: 'plan-est1',
    establishmentId: 'est1',
    date: TODAY,
    items: [
      { productId: 'p1', estimatedQty: 200, soldQtyHistory: [180, 175, 190, 185, 178, 182, 188] },
      { productId: 'p2', estimatedQty: 40, soldQtyHistory: [28, 32, 30, 27, 31, 29, 33] },
      { productId: 'p3', estimatedQty: 25, soldQtyHistory: [18, 20, 19, 17, 21, 18, 20] },
      { productId: 'p4', estimatedQty: 60, soldQtyHistory: [45, 50, 48, 47, 52, 49, 46] },
    ],
  },
  {
    id: 'plan-est2',
    establishmentId: 'est2',
    date: TODAY,
    items: [
      { productId: 'p5', estimatedQty: 80, soldQtyHistory: [65, 70, 68, 72, 66, 69, 71] },
      { productId: 'p6', estimatedQty: 30, soldQtyHistory: [22, 25, 24, 23, 26, 22, 24] },
      { productId: 'p7', estimatedQty: 25, soldQtyHistory: [15, 18, 17, 16, 19, 15, 17] },
      { productId: 'p8', estimatedQty: 50, soldQtyHistory: [38, 40, 42, 39, 41, 40, 43] },
    ],
  },
]

export const donationPartners = [
  { id: 'partner1', name: 'ONG Mesa Solidária', type: 'ONG' },
  { id: 'partner2', name: 'Abrigo Esperança', type: 'Abrigo' },
  { id: 'partner3', name: 'Banco de Alimentos Municipal', type: 'Banco de Alimentos' },
]

export const surplusListings = [
  {
    id: 'listing1',
    establishmentId: 'est1',
    productId: 'p2',
    quantity: 8,
    originalPrice: 6.5,
    discountedPrice: 3.5,
    destinationType: 'venda',
    donationPartner: null,
    expiresAt: `${TODAY}T21:00`,
    status: 'disponivel',
  },
  {
    id: 'listing2',
    establishmentId: 'est2',
    productId: 'p6',
    quantity: 5,
    originalPrice: 28.0,
    discountedPrice: 15.0,
    destinationType: 'venda',
    donationPartner: null,
    expiresAt: `${TODAY}T22:00`,
    status: 'disponivel',
  },
  {
    id: 'listing3',
    establishmentId: 'est1',
    productId: 'p1',
    quantity: 15,
    originalPrice: 0.75,
    discountedPrice: 0,
    destinationType: 'doacao',
    donationPartner: 'partner1',
    expiresAt: `${TODAY}T20:00`,
    status: 'doado',
  },
]

export const reservations = []

export function getInitialData() {
  return {
    establishments,
    products,
    productionPlans,
    surplusListings,
    donationPartners,
    reservations,
  }
}
