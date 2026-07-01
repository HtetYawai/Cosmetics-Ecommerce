import { Link } from 'react-router-dom'
import { Search, Sparkles, ChevronRight, Tag } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import ProductCard from '../components/ProductCard'
import { categories, getFeaturedProducts } from '../data'

export default function Home() {
  const featured = getFeaturedProducts()

  return (
    <AppLayout>
      <div className="bg-gradient-to-b from-brand-light to-white px-4 pb-6 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Welcome back ✨</p>
            <h1 className="font-serif text-2xl font-bold text-gray-900">GlowUp Beauty</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-pink-400 shadow-md">
            <span className="font-serif text-xl font-bold text-white">G</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, brands..."
            className="w-full rounded-2xl bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none ring-1 ring-gray-100"
          />
        </div>
      </div>

      <section className="px-4 py-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-pink-400 p-5 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">New Feature</span>
          </div>
          <h2 className="mt-2 font-serif text-xl font-bold">AI Skin Analysis</h2>
          <p className="mt-1 text-sm text-pink-100">
            Get personalized skincare recommendations tailored to your skin type.
          </p>
          <button className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand">
            Try Now ✨
          </button>
        </div>
      </section>

      <section className="px-4 py-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold">Categories</h2>
          <Link to="/categories" className="flex items-center text-sm text-brand">
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-brand-light ring-2 ring-brand/20">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold">Featured Products</h2>
          <Link to="/categories/makeup" className="flex items-center text-sm text-brand">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-4 mb-4 rounded-2xl bg-brand-light p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Tag className="h-5 w-5 text-brand" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Exclusive Member Offers</p>
            <p className="text-xs text-gray-500">Enjoy up to 30% off on selected items</p>
          </div>
          <Link
            to="/categories"
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </AppLayout>
  )
}
