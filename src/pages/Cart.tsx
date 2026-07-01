import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import Stepper from '../components/Stepper'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { items, itemCount, subtotal, discount, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()
  const shipping = items.length > 0 ? 50 : 0
  const total = subtotal + shipping - discount

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Shopping Cart" subtitle="Review your items before checkout" />

      <div className="px-4 pb-32">
        <Stepper current="cart" />

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="font-serif text-lg font-bold text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Add some beauty products to get started!</p>
            <Link
              to="/categories"
              className="mt-4 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white"
            >
              Browse Categories
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">{item.product.subtitle}</p>
                        {item.selectedShade && (
                          <p className="text-xs text-gray-400">Shade: {item.selectedShade}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center gap-3 rounded-lg bg-gray-50 px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="text-gray-500"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="text-gray-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {discount > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-light p-3">
                <Tag className="h-5 w-5 text-brand" />
                <p className="text-sm text-gray-700">
                  You saved <span className="font-bold text-brand">{formatPrice(discount)}</span> on
                  this order!
                </p>
              </div>
            )}

            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-3 font-semibold">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-200 pt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-brand">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-brand p-4 text-white">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div>
              <p className="text-xs text-pink-100">Total: {formatPrice(total)}</p>
              <p className="text-lg font-bold">{itemCount} items</p>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand"
            >
              Continue to Checkout →
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
