import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { defaultUser } from '../data'
import type { User } from '../types'
import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    getStorageItem(STORAGE_KEYS.AUTH, false)
  )
  const [user, setUser] = useState<User | null>(() =>
    getStorageItem<User | null>(STORAGE_KEYS.USER, null)
  )

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.AUTH, isAuthenticated)
  }, [isAuthenticated])

  useEffect(() => {
    if (user) setStorageItem(STORAGE_KEYS.USER, user)
  }, [user])

  const login = useCallback((email: string, _password: string) => {
    if (email.trim()) {
      const storedUser = getStorageItem<User | null>(STORAGE_KEYS.USER, null)
      setUser(storedUser ?? { ...defaultUser, email })
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    removeStorageItem(STORAGE_KEYS.AUTH)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
