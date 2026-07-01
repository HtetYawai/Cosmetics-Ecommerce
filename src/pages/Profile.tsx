import { useNavigate } from 'react-router-dom'
import {
  User,
  MapPin,
  Package,
  Heart,
  CreditCard,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Camera,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../contexts/AuthContext'

const menuItems = [
  { icon: User, label: 'Personal Information', sub: 'Update your profile details', path: '/profile' },
  { icon: MapPin, label: 'Address', sub: 'Manage shipping addresses', path: '/profile' },
  { icon: Package, label: 'Orders', sub: 'View order history', path: '/profile' },
  { icon: Heart, label: 'Wishlist', sub: 'Your saved items', path: '/profile' },
  { icon: CreditCard, label: 'Payment Methods', sub: 'Manage cards & wallets', path: '/profile' },
  { icon: Gift, label: 'Rewards & Points', sub: 'You have 320 points', path: '/profile' },
  { icon: Settings, label: 'Settings', sub: 'App preferences', path: '/profile' },
  { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs and contact us', path: '/profile' },
]

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
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
            <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
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
        {menuItems.map(({ icon: Icon, label, sub, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
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
        ))}

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
    </AppLayout>
  )
}
