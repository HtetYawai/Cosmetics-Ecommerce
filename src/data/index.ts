import categoriesData from './categories.json'
import productsData from './products.json'
import usersData from './users.json'
import addressesData from './addresses.json'
import deliveryOptionsData from './deliveryOptions.json'

import type {
  Category,
  Product,
  User,
  Address,
  DeliveryOption,
} from '../types'

export interface MockUser extends User {
  password: string
}

export const categories: Category[] = categoriesData as Category[]

export const products: Product[] = productsData as Product[]

export const users: MockUser[] = usersData as MockUser[]

export const addresses: Address[] = addressesData as Address[]

export const deliveryOptions: DeliveryOption[] =
  deliveryOptionsData as DeliveryOption[]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products
    .filter((p) => p.badge === 'Best Seller' || p.badge === 'New')
    .slice(0, 6)
}

export function searchProducts(
  query: string,
  categoryId?: string
): Product[] {
  const q = query.trim().toLowerCase()

  return products.filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false

    if (!q) return true

    const category = categories.find((c) => c.id === p.categoryId)

    const searchableText = [
      p.name,
      p.subtitle,
      p.description,
      p.badge,
      category?.name,
      ...(p.sizes ?? []),
      ...(p.shades ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(q)
  })
}