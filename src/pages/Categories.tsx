import { Link } from 'react-router-dom'
import {
  Sparkles,
  ChevronRight,
  Palette,
  Droplets,
  Brush,
  Flower2,
  Bath,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import PageHeader from '../components/PageHeader'
import { categories } from '../data'

const iconMap: Record<string, React.ReactNode> = {
  lipstick: <Palette className="h-6 w-6 text-brand" />,
  bottle: <Droplets className="h-6 w-6 text-brand" />,
  brush: <Brush className="h-6 w-6 text-brand" />,
  perfume: <Flower2 className="h-6 w-6 text-brand" />,
  lotion: <Bath className="h-6 w-6 text-brand" />,
}

export default function Categories() {
  return (
    <AppLayout>
      <PageHeader
        title="Categories"
        subtitle="Explore our wide range of beauty essentials and find your perfect match."
        showBack={false}
      />

      <div className="flex justify-center py-2">
        <Sparkles className="h-4 w-4 text-brand" />
      </div>

      <div className="space-y-4 px-4 pb-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-brand-light p-4 transition hover:shadow-md"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              {iconMap[cat.icon]}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg font-bold text-gray-900">{cat.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{cat.description}</p>
              <span className="mt-1 inline-flex items-center text-sm font-semibold text-brand">
                Shop {cat.name} <ChevronRight className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute -right-2 top-1/2 h-24 w-24 -translate-y-1/2 overflow-hidden rounded-xl opacity-80">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
