export interface User {
  _id: string
  email: string
  name: string
  phone?: string
  address?: string
  role: 'user' | 'admin'
  isActive: boolean
}

export interface Car {
  _id: string
  name: string
  brand: string
  model?: string
  type: 'compact' | 'suv' | 'berline' | 'break' | 'utilitaire'
  pricePerDay: number
  fuel: 'essence' | 'diesel' | 'electrique' | 'hybride'
  transmission: 'manuel' | 'automatique' | 'manuelle'
  seats: number
  images: string[]
  description?: string
  features: string[]
  availability: boolean
  location: string
  createdAt: string
}

export interface Reservation {
  _id: string
  userId: string | User
  carId: string | Car
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentId?: string
  pickupLocation: string
  dropoffLocation: string
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
}

export interface CarFilters {
  type?: string
  brand?: string
  fuel?: string
  transmission?: string
  minPrice?: number
  maxPrice?: number
  seats?: number
  availability?: boolean
  location?: string
}

