export const STORAGE_KEYS = {
  AUTH: 'glowup_auth',
  ADDRESSES: 'glowup_addresses',
  CART: 'glowup_cart',
  ORDERS: 'glowup_orders',
  PAYMENT_METHODS: 'glowup_payment_methods',
  USER: 'glowup_user',
  WISHLIST: 'glowup_wishlist',
  SETTINGS: 'glowup_settings',
} as const

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key)
}
