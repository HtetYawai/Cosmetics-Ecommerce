import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  showCart?: boolean
  showSparkles?: boolean
  rightAction?: ReactNode
  onBack?: () => void
}

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  showCart = true,
  showSparkles = true,
  rightAction,
  onBack,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-white/95 px-4 pb-3 pt-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {showBack ? (
          <button
            onClick={onBack ?? (() => navigate(-1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-gray-600 transition hover:bg-pink-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1.5">
            {showSparkles && <Sparkles className="h-3.5 w-3.5 text-brand" />}
            <h1 className="font-serif text-xl font-bold text-gray-900">{title}</h1>
            {showSparkles && <Sparkles className="h-3.5 w-3.5 text-brand" />}
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>

        {rightAction ?? (
          showCart ? (
            <button
              onClick={() => navigate('/cart')}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-50"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          ) : (
            <div className="w-10" />
          )
        )}
      </div>
    </header>
  )
}
