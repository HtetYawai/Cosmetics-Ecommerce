import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { getProductById } from '../data'
import type { CartItem, Product } from '../types'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage'

export interface CartLineItem extends CartItem {
  product: Product
}

interface CartContextType {
  items: CartLineItem[]
  itemCount: number
  subtotal: number
  discount: number
  addItem: (productId: string, quantity?: number, options?: { size?: string; shade?: string }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
  )

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, cartItems)
  }, [cartItems])

  const items = useMemo<CartLineItem[]>(() => {
    return cartItems
      .map((item) => {
        const product = getProductById(item.productId)
        return product ? { ...item, product } : null
      })
      .filter((item): item is CartLineItem => item !== null)
  }, [cartItems])

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  )

  const discount = useMemo(() => (subtotal > 2000 ? 230 : subtotal > 1000 ? 100 : 0), [subtotal])

  const addItem = useCallback(
    (productId: string, quantity = 1, options?: { size?: string; shade?: string }) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.productId === productId)
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
          )
        }
        return [
          ...prev,
          {
            productId,
            quantity,
            selectedSize: options?.size,
            selectedShade: options?.shade,
          },
        ]
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const isInCart = useCallback(
    (productId: string) => cartItems.some((i) => i.productId === productId),
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
