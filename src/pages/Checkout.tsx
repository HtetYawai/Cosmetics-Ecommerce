import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Truck,
  Plus,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Lock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import Stepper from '../components/Stepper'
import { addresses, deliveryOptions } from '../data'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/format'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'
import type { Address, Order, PaymentMethod } from '../types'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, discount, clearCart } = useCart()
  const savedAddresses = getStorageItem<Address[]>(STORAGE_KEYS.ADDRESSES, addresses)
  const [step, setStep] = useState<'checkout' | 'payment' | 'confirmation'>('checkout')
  const [selectedAddress, setSelectedAddress] = useState(
    savedAddresses.find((a) => a.isDefault)?.id ?? savedAddresses[0]?.id
  )
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]?.id)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [expandedPayment, setExpandedPayment] = useState<PaymentMethod>('card')
  const [saveCard, setSaveCard] = useState(true)

  const delivery = deliveryOptions.find((d) => d.id === selectedDelivery)
  const shipping = delivery?.price ?? 50
  const total = subtotal + shipping - discount

  const handleConfirmPayment = () => {
    const now = new Date()
    const savedOrders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, [])
    const order: Order = {
      id: `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}-${String(now.getTime()).slice(-5)}`,
      date: now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Processing',
      total,
      itemCount,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      image: items[0]?.product.image ?? '',
    }

    setStorageItem(STORAGE_KEYS.ORDERS, [order, ...savedOrders])
    setStep('confirmation')
    setTimeout(() => {
      clearCart()
    }, 500)
  }

  if (items.length === 0 && step !== 'confirmation') {
    navigate('/cart')
    return null
  }

  if (step === 'confirmation') {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <ShieldCheck className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Order Confirmed! ✨</h1>
          <p className="mt-2 text-sm text-gray-500">
            Thank you for shopping with GlowUp Beauty. Your order is being processed.
          </p>
          <p className="mt-1 text-lg font-bold text-brand">{formatPrice(total)}</p>
          <Stepper current="confirmation" />
          <button
            onClick={() => navigate('/home')}
            className="mt-8 rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white"
          >
            Continue Shopping
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showNav={false}>
      <PageHeader
        title={step === 'payment' ? 'Payment' : 'Checkout'}
        subtitle={
          step === 'payment'
            ? 'Choose your preferred payment method'
            : 'Review your order and confirm details'
        }
        onBack={step === 'payment' ? () => setStep('checkout') : undefined}
      />

      <div className="space-y-4 px-4 pb-32">
        <Stepper current={step} />

        {step === 'checkout' && (
          <>
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand" />
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
              <div className="space-y-2">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`w-full rounded-xl p-3 text-left transition ${
                      selectedAddress === addr.id
                        ? 'bg-brand-light ring-2 ring-brand'
                        : 'bg-gray-50 ring-1 ring-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                          selectedAddress === addr.id
                            ? 'border-brand bg-brand'
                            : 'border-gray-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{addr.address}</p>
                        <p className="text-xs text-gray-400">{addr.phone}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
              <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand">
                <Plus className="h-4 w-4" /> Add New Address
              </button>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand" />
                <h3 className="font-semibold">Delivery Option</h3>
              </div>
              <div className="space-y-2">
                {deliveryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedDelivery(opt.id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      selectedDelivery === opt.id ? 'bg-brand-light' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                        selectedDelivery === opt.id
                          ? 'border-brand bg-brand'
                          : 'border-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{opt.name}</p>
                      <p className="text-xs text-gray-500">{opt.description}</p>
                    </div>
                    <span className="text-sm font-bold text-brand">{formatPrice(opt.price)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="mb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand" />
                <h3 className="font-semibold">Order Summary</h3>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.product.subtitle} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-dashed border-gray-200 pt-3 text-sm">
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
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand">{formatPrice(total)}</span>
                </div>
              </div>
            </section>
          </>
        )}

        {step === 'payment' && (
          <>
            <div className="space-y-3">
              {(
                [
                  {
                    id: 'card' as PaymentMethod,
                    title: 'Credit / Debit Card',
                    subtitle: 'Pay securely using your card',
                    logos: ['VISA', 'MC', 'JCB'],
                  },
                  {
                    id: 'promptpay' as PaymentMethod,
                    title: 'PromptPay',
                    subtitle: 'Scan QR code to pay instantly',
                  },
                  {
                    id: 'qr' as PaymentMethod,
                    title: 'QR Payment',
                    subtitle: 'Pay with mobile banking app',
                  },
                  {
                    id: 'wallet' as PaymentMethod,
                    title: 'Apple Pay / Google Pay',
                    subtitle: 'Fast and secure wallet payment',
                    recommended: true,
                  },
                ] as const
              ).map((method) => (
                <div
                  key={method.id}
                  className={`overflow-hidden rounded-2xl transition ${
                    paymentMethod === method.id
                      ? 'bg-brand-light ring-2 ring-brand'
                      : 'bg-white ring-1 ring-gray-100'
                  }`}
                >
                  <button
                    onClick={() => {
                      setPaymentMethod(method.id)
                      setExpandedPayment(method.id)
                    }}
                    className="flex w-full items-center gap-3 p-4"
                  >
                    <div
                      className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                        paymentMethod === method.id
                          ? 'border-brand bg-brand'
                          : 'border-gray-300'
                      }`}
                    />
                    <CreditCard className="h-5 w-5 text-brand" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{method.title}</span>
                        {'recommended' in method && method.recommended && (
                          <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{method.subtitle}</p>
                    </div>
                    {'logos' in method && method.logos && (
                      <div className="flex gap-1 text-[10px] font-bold text-gray-400">
                        {method.logos.map((l) => (
                          <span key={l}>{l}</span>
                        ))}
                      </div>
                    )}
                    {expandedPayment === method.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {method.id === 'card' && expandedPayment === 'card' && paymentMethod === 'card' && (
                    <div className="space-y-3 border-t border-pink-100 px-4 pb-4 pt-3">
                      <input
                        defaultValue="4242 4242 4242 4242"
                        placeholder="Card Number"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          defaultValue="Khin Yadanar Kyaw"
                          placeholder="Cardholder Name"
                          className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                        <input
                          defaultValue="12 / 28"
                          placeholder="Expiry"
                          className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="password"
                          defaultValue="123"
                          placeholder="CVV"
                          className="w-24 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                        <label className="flex items-center gap-2 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="accent-brand"
                          />
                          Save card for faster checkout
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="mb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand" />
                <h3 className="font-semibold">Order Summary</h3>
              </div>
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
                    <span>Total Amount</span>
                    <span className="text-brand">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-brand-light p-3">
              <Lock className="h-4 w-4 text-brand" />
              <p className="text-xs text-gray-600">
                Your payment information is secure and encrypted.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              {step === 'payment' ? 'Total Payment' : 'Total'}
            </p>
            <p className="text-xl font-bold text-brand">{formatPrice(total)}</p>
          </div>
          <button
            onClick={() => (step === 'checkout' ? setStep('payment') : handleConfirmPayment())}
            className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white"
          >
            <Lock className="h-4 w-4" />
            {step === 'checkout' ? 'Continue to Payment' : 'Confirm Payment'}
          </button>
        </div>
        {step === 'payment' && (
          <p className="mx-auto mt-2 max-w-lg text-center text-[10px] text-gray-400">
            By continuing, you agree to our Terms & Conditions.
          </p>
        )}
      </div>
    </AppLayout>
  )
}
