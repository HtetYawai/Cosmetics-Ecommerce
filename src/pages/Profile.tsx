import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  MapPin,
  Package,
  Heart,
  CreditCard,
  Wallet,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Camera,
  Home,
  Briefcase,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  ShoppingBag,
  X,
  type LucideIcon,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { addresses as defaultAddresses, getProductById } from '../data'
import type { Address, Order, PaymentMethod } from '../types'
import { formatPrice } from '../utils/format'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

type MenuItem =
  | {
      icon: LucideIcon
      label: string
      sub: string
      action: 'personal' | 'addresses' | 'orders' | 'wishlist' | 'payments'  | 'settings' 
    }
  | {
      icon: LucideIcon
      label: string
      sub: string
      path: string
    }

const menuItems: MenuItem[] = [
  { icon: User, label: 'Personal Information', sub: 'Update your profile details', action: 'personal' },
  { icon: MapPin, label: 'Address', sub: 'Manage shipping addresses', action: 'addresses' },
  { icon: Package, label: 'Orders', sub: 'View order history', action: 'orders' },
  { icon: Heart, label: 'Wishlist', sub: 'Your saved items', action: 'wishlist' },
  { icon: CreditCard, label: 'Payment Methods', sub: 'Manage cards & wallets', action: 'payments' },
  { icon: Settings, label: 'Settings', sub: 'App preferences', action: 'settings' },
]

const addressIconMap = {
  home: Home,
  work: Briefcase,
  dorm: GraduationCap,
}

interface SavedPaymentMethod {
  id: string
  type: PaymentMethod
  label: string
  detail: string
  holderName: string
  isDefault: boolean
}

const defaultPaymentMethods: SavedPaymentMethod[] = [
  {
    id: 'pay-card-1',
    type: 'card',
    label: 'Visa Card',
    detail: '4242',
    holderName: 'Khin Yadanar Kyaw',
    isDefault: true,
  },
]

const paymentTypeLabels: Record<PaymentMethod, string> = {
  card: 'Credit / Debit Card',
  promptpay: 'PromptPay',
  qr: 'QR Payment',
  wallet: 'Apple Pay / Google Pay',
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isManagingAddresses, setIsManagingAddresses] = useState(false)
  const [isViewingOrders, setIsViewingOrders] = useState(false)
  const [isViewingWishlist, setIsViewingWishlist] = useState(false)
  const [isManagingPayments, setIsManagingPayments] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    badge: '',
    avatar: '',
  })
  const [addressList, setAddressList] = useState<Address[]>(() =>
    getStorageItem<Address[]>(STORAGE_KEYS.ADDRESSES, defaultAddresses)
  )
  const [orderList, setOrderList] = useState<Order[]>(() =>
    getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, [])
  )
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, [])
  )
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>(() =>
    getStorageItem<SavedPaymentMethod[]>(STORAGE_KEYS.PAYMENT_METHODS, defaultPaymentMethods)
  )
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: 'Home',
    name: '',
    address: '',
    phone: '',
    icon: 'home',
  })
  const [paymentForm, setPaymentForm] = useState<Omit<SavedPaymentMethod, 'id' | 'isDefault'>>({
    type: 'card',
    label: 'Visa Card',
    detail: '',
    holderName: user?.fullName ?? '',
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [settings, setSettings] = useState(() =>
    getStorageItem(STORAGE_KEYS.SETTINGS, {
      darkMode: false,
      notifications: true,
      emailNotifications: true,
      language: 'English',
      currency: 'THB',
      country: 'Thailand',
    })
  )

  useEffect(() => {
  setStorageItem(STORAGE_KEYS.SETTINGS, settings)
}, [settings])
useEffect(() => {
  document.documentElement.classList.toggle(
    "dark",
    settings.darkMode
  )
}, [settings.darkMode])
  const [formError, setFormError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    setFormData({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      badge: user?.badge ?? '',
      avatar: user?.avatar ?? '',
    })
  }, [user])

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ADDRESSES, addressList)
  }, [addressList])

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.PAYMENT_METHODS, paymentMethods)
  }, [paymentMethods])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openProfileEditor = () => {
    setFormError('')
    setIsEditingProfile(true)
  }

  const resetAddressForm = () => {
    setEditingAddressId(null)
    setAddressError('')
    setAddressForm({
      label: 'Home',
      name: user?.fullName ?? '',
      address: '',
      phone: user?.phone ?? '',
      icon: 'home',
    })
  }

  const openAddressManager = () => {
    resetAddressForm()
    setIsManagingAddresses(true)
  }

  const openOrderHistory = () => {
    setOrderList(getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []))
    setIsViewingOrders(true)
  }

  const openWishlist = () => {
    setWishlistIds(getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, []))
    setIsViewingWishlist(true)
  }

  const resetPaymentForm = () => {
    setEditingPaymentId(null)
    setPaymentError('')
    setPaymentForm({
      type: 'card',
      label: 'Visa Card',
      detail: '',
      holderName: user?.fullName ?? '',
    })
  }

  const openPaymentManager = () => {
    resetPaymentForm()
    setPaymentMethods(
      getStorageItem<SavedPaymentMethod[]>(STORAGE_KEYS.PAYMENT_METHODS, defaultPaymentMethods)
    )
    setIsManagingPayments(true)
  }

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.fullName.trim()) {
      setFormError('Please enter your full name')
      return
    }

    if (!formData.email.trim()) {
      setFormError('Please enter your email')
      return
    }

    updateUser({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      badge: formData.badge.trim() || 'Beauty Lover',
      avatar: formData.avatar.trim(),
    })
    setIsEditingProfile(false)
  }

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!addressForm.name.trim()) {
      setAddressError('Please enter a recipient name')
      return
    }

    if (!addressForm.address.trim()) {
      setAddressError('Please enter an address')
      return
    }

    if (!addressForm.phone.trim()) {
      setAddressError('Please enter a phone number')
      return
    }

    if (editingAddressId) {
      setAddressList((prev) =>
        prev.map((address) =>
          address.id === editingAddressId
            ? {
                ...address,
                ...addressForm,
                label: addressForm.label.trim() || 'Address',
                name: addressForm.name.trim(),
                address: addressForm.address.trim(),
                phone: addressForm.phone.trim(),
              }
            : address
        )
      )
    } else {
      setAddressList((prev) => [
        ...prev,
        {
          id: `addr-${Date.now()}`,
          ...addressForm,
          label: addressForm.label.trim() || 'Address',
          name: addressForm.name.trim(),
          address: addressForm.address.trim(),
          phone: addressForm.phone.trim(),
          isDefault: prev.length === 0,
        },
      ])
    }

    resetAddressForm()
  }

  const handlePaymentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!paymentForm.label.trim()) {
      setPaymentError('Please enter a payment label')
      return
    }

    if (!paymentForm.detail.trim()) {
      setPaymentError(
        paymentForm.type === 'card'
          ? 'Please enter the last 4 digits'
          : 'Please enter an account detail'
      )
      return
    }

    if (paymentForm.type === 'card' && !/^\d{4}$/.test(paymentForm.detail.trim())) {
      setPaymentError('Card detail should be the last 4 digits')
      return
    }

    if (editingPaymentId) {
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === editingPaymentId
            ? {
                ...method,
                ...paymentForm,
                label: paymentForm.label.trim(),
                detail: paymentForm.detail.trim(),
                holderName: paymentForm.holderName.trim(),
              }
            : method
        )
      )
    } else {
      setPaymentMethods((prev) => [
        ...prev,
        {
          id: `pay-${Date.now()}`,
          ...paymentForm,
          label: paymentForm.label.trim(),
          detail: paymentForm.detail.trim(),
          holderName: paymentForm.holderName.trim(),
          isDefault: prev.length === 0,
        },
      ])
    }

    resetPaymentForm()
  }

  const editAddress = (address: Address) => {
    setAddressError('')
    setEditingAddressId(address.id)
    setAddressForm({
      label: address.label,
      name: address.name,
      address: address.address,
      phone: address.phone,
      icon: address.icon,
    })
  }

  const setDefaultAddress = (id: string) => {
    setAddressList((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    )
  }

  const deleteAddress = (id: string) => {
    setAddressList((prev) => {
      const next = prev.filter((address) => address.id !== id)

      if (next.length > 0 && !next.some((address) => address.isDefault)) {
        return next.map((address, index) => ({
          ...address,
          isDefault: index === 0,
        }))
      }

      return next
    })

    if (editingAddressId === id) {
      resetAddressForm()
    }
  }

  const editPaymentMethod = (method: SavedPaymentMethod) => {
    setPaymentError('')
    setEditingPaymentId(method.id)
    setPaymentForm({
      type: method.type,
      label: method.label,
      detail: method.detail,
      holderName: method.holderName,
    })
  }

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    )
  }

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => {
      const next = prev.filter((method) => method.id !== id)

      if (next.length > 0 && !next.some((method) => method.isDefault)) {
        return next.map((method, index) => ({
          ...method,
          isDefault: index === 0,
        }))
      }

      return next
    })

    if (editingPaymentId === id) {
      resetPaymentForm()
    }
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = prev.filter((id) => id !== productId)
      setStorageItem(STORAGE_KEYS.WISHLIST, next)
      return next
    })
  }

  const handleMenuClick = (item: (typeof menuItems)[number]) => {
    if ('action' in item && item.action === 'personal') {
      openProfileEditor()
      return
    }

    if ('action' in item && item.action === 'addresses') {
      openAddressManager()
      return
    }

    if ('action' in item && item.action === 'orders') {
      openOrderHistory()
      return
    }

    if ('action' in item && item.action === 'wishlist') {
      openWishlist()
      return
    }

    if ('action' in item && item.action === 'payments') {
      openPaymentManager()
      return
    }

    if ('action' in item && item.action === 'settings') {
      setIsSettingsOpen(true)
      return
    }

    if ('path' in item) {
      navigate(item.path)
    }
  }

  return (
    <AppLayout>
      <div className="bg-gradient-to-b from-brand-light to-white px-4 pb-4 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold">My Account</h1>
          <button className="relative text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand" />
          </button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur-sm">
          <div className="relative">
            <img
              src={user?.avatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'}
              alt={user?.fullName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand/30"
            />
            <button
              type="button"
              onClick={openProfileEditor}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white"
              aria-label="Edit profile"
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold">{user?.fullName ?? 'Guest'}</h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400">{user?.phone}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-semibold text-brand">
              <Heart className="h-3 w-3" /> {user?.badge ?? 'Beauty Lover'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 px-4 pb-4">
        {menuItems.map((item) => {
          const { icon: Icon, label, sub } = item

          return (
          <button
            key={label}
            onClick={() => handleMenuClick(item)}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
              <Icon className="h-5 w-5 text-brand" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </button>
          )
        })}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-red-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
            <LogOut className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-500">Log Out</p>
        </button>
      </div>

      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 px-4 pb-4 sm:items-center sm:justify-center sm:py-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500">Update your profile details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close profile editor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Full Name</span>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Phone</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Badge</span>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, badge: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Avatar URL</span>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, avatar: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isManagingAddresses && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 px-4 pb-4 sm:items-center sm:justify-center sm:py-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900">Shipping Addresses</h2>
                <p className="text-xs text-gray-500">Manage shipping addresses</p>
              </div>
              <button
                type="button"
                onClick={() => setIsManagingAddresses(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close address manager"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {addressList.map((address) => {
                const Icon = addressIconMap[address.icon]

                return (
                  <div
                    key={address.id}
                    className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                        <Icon className="h-5 w-5 text-brand" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{address.label}</p>
                          {address.isDefault && (
                            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-medium text-gray-700">{address.name}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          {address.address}
                        </p>
                        <p className="text-xs text-gray-400">{address.phone}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 pl-13">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(address.id)}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/20"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => editAddress(address)}
                        className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAddress(address.id)}
                        className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-500 ring-1 ring-red-100"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                )
              })}

              {addressList.length === 0 && (
                <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                  No saved addresses yet
                </div>
              )}
            </div>

            <form onSubmit={handleAddressSubmit} className="mt-5 space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h3>
                {editingAddressId && (
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="text-xs font-semibold text-brand"
                  >
                    Add Instead
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['home', 'work', 'dorm'] as const).map((icon) => {
                  const Icon = addressIconMap[icon]

                  return (
                    <button
                      key={icon}
                      type="button"
                      onClick={() =>
                        setAddressForm((prev) => ({
                          ...prev,
                          icon,
                          label:
                            icon === 'home'
                              ? 'Home'
                              : icon === 'work'
                                ? 'Work'
                                : 'Dorm',
                        }))
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold capitalize ring-1 transition ${
                        addressForm.icon === icon
                          ? 'bg-brand-light text-brand ring-brand/30'
                          : 'bg-gray-50 text-gray-500 ring-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {icon}
                    </button>
                  )
                })}
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Label</span>
                <input
                  type="text"
                  value={addressForm.label}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, label: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Recipient Name</span>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Address</span>
                <textarea
                  value={addressForm.address}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Phone</span>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(event) =>
                    setAddressForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              {addressError && <p className="text-sm text-red-500">{addressError}</p>}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                <Plus className="h-4 w-4" />
                {editingAddressId ? 'Save Address' : 'Add Address'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isViewingOrders && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 px-4 pb-4 sm:items-center sm:justify-center sm:py-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900">Order History</h2>
                <p className="text-xs text-gray-500">View order history</p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewingOrders(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close order history"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {orderList.length > 0 ? (
              <div className="space-y-3">
                {orderList.map((order) => (
                  <div key={order.id} className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                    <div className="flex items-start gap-3">
                      <img
                        src={order.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900">{order.id}</p>
                          <span className="rounded bg-brand-light px-2 py-1 text-[10px] font-semibold text-brand">
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.date} at {order.time}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-brand">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <div className="mt-3 space-y-2 border-t border-dashed border-gray-200 pt-3">
                      {order.items.map((item) => {
                        const product = getProductById(item.productId)

                        return (
                          <div key={item.productId} className="flex items-center gap-2">
                            <img
                              src={product?.image ?? order.image}
                              alt={product?.name ?? 'Product'}
                              className="h-9 w-9 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-gray-800">
                                {product?.name ?? 'Product unavailable'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {product?.subtitle ?? 'Order item'} x {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {product ? formatPrice(product.price * item.quantity) : ''}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 px-5 py-10 text-center ring-1 ring-gray-100">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
                  <Package className="h-6 w-6 text-brand" />
                </div>
                <p className="text-sm font-semibold text-gray-900">No orders yet</p>
                <p className="mt-1 text-xs text-gray-500">
                  Your completed checkout orders will appear here.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewingOrders(false)
                    navigate('/home')
                  }}
                  className="mt-4 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isViewingWishlist && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 px-4 pb-4 sm:items-center sm:justify-center sm:py-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900">Wishlist</h2>
                <p className="text-xs text-gray-500">Your saved items</p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewingWishlist(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close wishlist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {wishlistIds.length > 0 ? (
              <div className="space-y-3">
                {wishlistIds.map((productId) => {
                  const product = getProductById(productId)

                  if (!product) return null

                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewingWishlist(false)
                          navigate(`/products/${product.id}`)
                        }}
                        className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-light"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsViewingWishlist(false)
                            navigate(`/products/${product.id}`)
                          }}
                          className="block max-w-full text-left"
                        >
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">{product.subtitle}</p>
                        </button>
                        <p className="mt-1 text-sm font-bold text-brand">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => addItem(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white"
                          aria-label="Add wishlist item to cart"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 ring-1 ring-red-100"
                          aria-label="Remove wishlist item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 px-5 py-10 text-center ring-1 ring-gray-100">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
                  <Heart className="h-6 w-6 text-brand" />
                </div>
                <p className="text-sm font-semibold text-gray-900">No saved items yet</p>
                <p className="mt-1 text-xs text-gray-500">
                  Tap the heart on products you love and they will appear here.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewingWishlist(false)
                    navigate('/home')
                  }}
                  className="mt-4 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white"
                >
                  Discover Products
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isManagingPayments && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 px-4 pb-4 sm:items-center sm:justify-center sm:py-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-gray-900">Payment Methods</h2>
                <p className="text-xs text-gray-500">Manage cards & wallets</p>
              </div>
              <button
                type="button"
                onClick={() => setIsManagingPayments(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100"
                aria-label="Close payment methods"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div key={method.id} className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                      {method.type === 'wallet' ? (
                        <Wallet className="h-5 w-5 text-brand" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-brand" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                        {method.isDefault && (
                          <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {paymentTypeLabels[method.type]}
                      </p>
                      <p className="text-xs text-gray-400">
                        {method.type === 'card' ? `Ending in ${method.detail}` : method.detail}
                      </p>
                      {method.holderName && (
                        <p className="text-xs text-gray-400">{method.holderName}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 pl-13">
                    {!method.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/20"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => editPaymentMethod(method)}
                      className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePaymentMethod(method.id)}
                      className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-500 ring-1 ring-red-100"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {paymentMethods.length === 0 && (
                <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                  No saved payment methods yet
                </div>
              )}
            </div>

            <form onSubmit={handlePaymentSubmit} className="mt-5 space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  {editingPaymentId ? 'Edit Payment Method' : 'Add Payment Method'}
                </h3>
                {editingPaymentId && (
                  <button
                    type="button"
                    onClick={resetPaymentForm}
                    className="text-xs font-semibold text-brand"
                  >
                    Add Instead
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(['card', 'promptpay', 'qr', 'wallet'] as PaymentMethod[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        type,
                        label: paymentTypeLabels[type],
                        detail: '',
                      }))
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition ${
                      paymentForm.type === type
                        ? 'bg-brand-light text-brand ring-brand/30'
                        : 'bg-gray-50 text-gray-500 ring-gray-100'
                    }`}
                  >
                    {type === 'wallet' ? (
                      <Wallet className="h-4 w-4" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {type === 'promptpay' ? 'PromptPay' : type === 'qr' ? 'QR' : type}
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">Label</span>
                <input
                  type="text"
                  value={paymentForm.label}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, label: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  {paymentForm.type === 'card' ? 'Last 4 Digits' : 'Account Detail'}
                </span>
                <input
                  type={paymentForm.type === 'card' ? 'text' : 'text'}
                  inputMode={paymentForm.type === 'card' ? 'numeric' : 'text'}
                  maxLength={paymentForm.type === 'card' ? 4 : undefined}
                  value={paymentForm.detail}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, detail: event.target.value }))
                  }
                  placeholder={
                    paymentForm.type === 'card'
                      ? '4242'
                      : paymentForm.type === 'promptpay'
                        ? '+66 81 234 5678'
                        : paymentForm.type === 'wallet'
                          ? 'Apple Pay'
                          : 'Mobile banking app'
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Name on Method
                </span>
                <input
                  type="text"
                  value={paymentForm.holderName}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, holderName: event.target.value }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-gray-100 transition focus:ring-brand/30"
                />
              </label>

              {paymentError && <p className="text-sm text-red-500">{paymentError}</p>}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                <Plus className="h-4 w-4" />
                {editingPaymentId ? 'Save Payment Method' : 'Add Payment Method'}
              </button>
            </form>
          </div>
        </div>
      )}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 px-4 pb-4 sm:items-center sm:justify-center sm:py-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">

            {/* Header */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">
                  Settings
                </h2>
                <p className="text-xs text-gray-500">
                  Customize your app preferences
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Appearance */}

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-gray-800">
                Appearance
              </h3>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                <div>
                  <p className="text-sm font-semibold">
                    Dark Mode
                  </p>
                  <p className="text-xs text-gray-500">
                    Switch between light and dark theme
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      darkMode: !settings.darkMode,
                    })
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    settings.darkMode
                      ? 'bg-brand'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      settings.darkMode
                        ? 'left-6'
                        : 'left-1'
                    }`}
                  />
                </button>

              </div>
            </div>

            {/* Notifications */}

            <div className="mb-6">

              <h3 className="mb-3 text-sm font-bold text-gray-800">
                Notifications
              </h3>

              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div>
                    <p className="text-sm font-semibold">
                      Push Notifications
                    </p>

                    <p className="text-xs text-gray-500">
                      Receive promotions & order updates
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notifications: !settings.notifications,
                      })
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      settings.notifications
                        ? 'bg-brand'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        settings.notifications
                          ? 'left-6'
                          : 'left-1'
                      }`}
                    />
                  </button>

                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                  <div>
                    <p className="text-sm font-semibold">
                      Email Notifications
                    </p>

                    <p className="text-xs text-gray-500">
                      Receive newsletters and offers
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        emailNotifications:
                          !settings.emailNotifications,
                      })
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      settings.emailNotifications
                        ? 'bg-brand'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        settings.emailNotifications
                          ? 'left-6'
                          : 'left-1'
                      }`}
                    />
                  </button>

                </div>

              </div>

            </div>

            {/* Language */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold">
                Language
              </label>

              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    language: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-gray-50 px-4 py-3 outline-none ring-1 ring-gray-100 focus:ring-brand/30"
              >
                <option>English</option>
                <option>Thai</option>
              </select>

            </div>

            {/* Currency */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold">
                Currency
              </label>

              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    currency: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-gray-50 px-4 py-3 outline-none ring-1 ring-gray-100 focus:ring-brand/30"
              >
                <option>THB</option>
                <option>USD</option>
                <option>MMK</option>
              </select>

            </div>

            {/* Country */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold">
                Country
              </label>

              <select
                value={settings.country}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    country: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-gray-50 px-4 py-3 outline-none ring-1 ring-gray-100 focus:ring-brand/30"
              >
                <option>Thailand</option>
                <option>Myanmar</option>
                <option>Singapore</option>
                <option>Malaysia</option>
              </select>

            </div>

            {/* Change Password */}

            <button
              className="mb-5 w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Change Password
            </button>

            {/* Version */}

            <div className="mb-6 text-center">

              <p className="text-xs text-gray-400">
                GlowUp Beauty
              </p>

              <p className="text-xs text-gray-400">
                Version 1.0.0
              </p>

            </div>

            {/* Buttons */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setStorageItem(STORAGE_KEYS.SETTINGS, settings)
                  setIsSettingsOpen(false)
                }}
                className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                Save Settings
              </button>

            </div>

          </div>
        </div>
      )}
    </AppLayout>
  )
}
