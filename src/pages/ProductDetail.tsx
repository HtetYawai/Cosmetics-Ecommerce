import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import StarRating from '../components/StarRating'
import { getProductById } from '../data'
import { formatPrice } from '../utils/format'
import { useCart } from '../contexts/CartContext'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = getProductById(id ?? '')
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedShade, setSelectedShade] = useState(product?.shades?.[0])
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0])
  const [added, setAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(() =>
    getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, []).includes(id ?? '')
  )

  if (!product) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center text-gray-500">Product not found</div>
      </AppLayout>
    )
  }

  const handleAddToCart = () => {
    addItem(product.id, quantity, { shade: selectedShade, size: selectedSize })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const toggleWishlist = () => {
    const savedIds = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, [])
    const nextIds = savedIds.includes(product.id)
      ? savedIds.filter((savedId) => savedId !== product.id)
      : [product.id, ...savedIds]

    setStorageItem(STORAGE_KEYS.WISHLIST, nextIds)
    setIsWishlisted(nextIds.includes(product.id))
  }

  return (
    <AppLayout showNav={false}>
      <PageHeader title={product.name} subtitle={product.subtitle} />

      <div className="px-4 pb-28">
        <div className="relative overflow-hidden rounded-2xl bg-brand-light">
          <img
            src={product.images[selectedImage] ?? product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          )}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm ${
              isWishlisted ? 'text-brand' : 'text-gray-400'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`h-16 w-16 overflow-hidden rounded-lg ring-2 ${
                  selectedImage === idx ? 'ring-brand' : 'ring-transparent'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <h2 className="font-serif text-xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500">{product.subtitle}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
          </div>
        </div>

        {product.shades && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">Shade</p>
            <div className="flex flex-wrap gap-2">
              {product.shades.map((shade) => (
                <button
                  key={shade}
                  onClick={() => setSelectedShade(shade)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    selectedShade === shade
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {shade}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    selectedSize === size
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">Quantity</p>
          <div className="inline-flex items-center gap-4 rounded-xl bg-gray-50 px-4 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-500 hover:text-brand"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-gray-500 hover:text-brand"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">Description</p>
          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-brand text-white hover:bg-brand-dark'
            }`}
          >
            {added ? (
              <>
                <Check className="h-5 w-5" /> Added!
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
              </>
            )}
          </button>
          <button
            onClick={() => {
              handleAddToCart()
              navigate('/cart')
            }}
            className="rounded-xl bg-brand-light px-6 py-3.5 text-sm font-bold text-brand"
          >
            Buy Now
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
