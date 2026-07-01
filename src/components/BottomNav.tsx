import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Sparkles, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/categories', label: 'Categories', icon: LayoutGrid },
  { path: '/home', label: 'AI Skin', icon: Sparkles },
  { path: '/cart', label: 'Cart', icon: ShoppingBag, badge: 'cart' as const },
  { path: '/profile', label: 'Account', icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const { itemCount } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon, badge }) => {
          const active =
            path === '/home'
              ? location.pathname === '/home'
              : location.pathname.startsWith(path)
          const count = badge === 'cart' ? itemCount : 0

          return (
            <Link
              key={label}
              to={path}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                active ? 'text-brand' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className={active ? 'font-medium' : ''}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
