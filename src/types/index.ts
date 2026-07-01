export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  productCount: number
  image: string
}

export interface Product {
  id: string
  categoryId: string
  name: string
  subtitle: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  rating: number
  reviewCount: number
  badge?: 'Best Seller' | 'New' | 'Sale'
  inStock: boolean
  sizes?: string[]
  shades?: string[]
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  avatar: string
  dateOfBirth: string
  gender: 'Female' | 'Male' | 'Other'
  accountType: string
  points: number
  badge: string
}

export interface Address {
  id: string
  label: string
  name: string
  address: string
  phone: string
  isDefault: boolean
  icon: 'home' | 'work' | 'dorm'
}

export interface CartItem {
  productId: string
  quantity: number
  selectedSize?: string
  selectedShade?: string
}

export interface DeliveryOption {
  id: string
  name: string
  description: string
  price: number
  icon: string
}

export interface Order {
  id: string
  date: string
  time: string
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Cancelled'
  total: number
  itemCount: number
  items: { productId: string; quantity: number }[]
  image: string
}

export type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'confirmation'

export type PaymentMethod = 'card' | 'promptpay' | 'qr' | 'wallet'
