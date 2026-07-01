import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ShoppingBag } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { getCategoryBySlug, getProductsByCategory, searchProducts } from '../data'

type SortOption = 'popularity' | 'price-low' | 'price-high' | 'rating'

export default function ProductList() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = getCategoryBySlug(slug ?? '')
  const query = searchParams.get('q') ?? ''
  const [search, setSearch] = useState(query)
  const [sort, setSort] = useState<SortOption>('popularity')
  const isSearchPage = !slug

  useEffect(() => {
    setSearch(query)
  }, [query])

  const products = useMemo(() => {
    let list = category
      ? search.trim() ? searchProducts(search, category.id) : getProductsByCategory(category.id)
      : searchProducts(search)

    switch (sort) {
      case 'price-low':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
      default:
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return list
  }, [category, search, sort])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchParams(value.trim() ? { q: value } : {}, { replace: true })
  }

  if (!category && !isSearchPage) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center text-gray-500">Category not found</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader
        title={category?.name ?? 'Search'}
        subtitle={category ? 'Find your perfect makeup match' : 'Browse all beauty products'}
      />

      <div className="space-y-3 px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={category ? `Search in ${category.name}` : 'Search products, brands...'}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl bg-gray-50 py-3 pl-10 pr-10 text-sm outline-none ring-1 ring-gray-100 focus:ring-brand/30"
          />
          <SlidersHorizontal className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <button className="flex items-center gap-1.5 rounded-lg bg-brand-light px-3 py-1.5 text-brand">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          <span className="text-gray-500">{products.length} Products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg bg-transparent text-sm text-gray-600 outline-none"
          >
            <option value="popularity">Sort by: Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length > 4 && (
          <>
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-light p-4">
              <ShoppingBag className="h-8 w-8 shrink-0 text-brand" />
              <p className="flex-1 text-xs text-gray-600">
                Can't find what you're looking for? Let us help you find the perfect product.
              </p>
              <button className="shrink-0 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white">
                Try AI Skin Analysis ✨
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {products.slice(4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {products.length <= 4 && products.length > 0 && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-light p-4">
            <ShoppingBag className="h-8 w-8 shrink-0 text-brand" />
            <p className="flex-1 text-xs text-gray-600">
              Can't find what you're looking for? Let us help you find the perfect product.
            </p>
            <button className="shrink-0 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white">
              Try AI Skin Analysis ✨
            </button>
          </div>
        )}

        {products.length === 0 && (
          <div className="py-12 text-center text-gray-500">No products found</div>
        )}
      </div>
    </AppLayout>
  )
}
