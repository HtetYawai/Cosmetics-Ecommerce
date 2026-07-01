import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'
import StarRating from './StarRating'
import { useCart } from '../contexts/CartContext'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

interface ProductCardProps {
  product: Product
  showAddButton?: boolean
}

export default function ProductCard({ product, showAddButton = true }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(() =>
    getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, []).includes(product.id)
  )

  const badgeColors = {
    'Best Seller': 'bg-brand text-white',
    New: 'bg-pink-200 text-brand',
    Sale: 'bg-orange-400 text-white',
  }

  const toggleWishlist = () => {
    const savedIds = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, [])
    const nextIds = savedIds.includes(product.id)
      ? savedIds.filter((id) => id !== product.id)
      : [product.id, ...savedIds]

    setStorageItem(STORAGE_KEYS.WISHLIST, nextIds)
    setIsWishlisted(nextIds.includes(product.id))
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-light">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
          {product.badge && (
            <span
              className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-semibold ${badgeColors[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist()
            }}
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition hover:text-brand ${
              isWishlisted ? 'text-brand' : 'text-gray-400'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">{product.name}</h3>
          <p className="text-xs text-gray-500">{product.subtitle}</p>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-brand">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </Link>
      {showAddButton && (
        <button
          onClick={() => addItem(product.id)}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-dark"
          aria-label="Add to cart"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
