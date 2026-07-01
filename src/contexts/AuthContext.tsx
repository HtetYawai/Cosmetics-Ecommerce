import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

import type { User } from '../types'
import users from '../data/users.json'

import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from '../utils/storage'

interface MockUser extends User {
  password: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User |null
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
    if (user) {
      setStorageItem(STORAGE_KEYS.USER, user)
    } else {
      removeStorageItem(STORAGE_KEYS.USER)
    }
  }, [user])

  const login = useCallback((email: string, password: string) => {
    const foundUser = (users as MockUser[]).find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    )

    if (!foundUser) {
      return false
    }

    const { password: _, ...currentUser } = foundUser

    setUser(currentUser)
    setIsAuthenticated(true)

    setStorageItem(STORAGE_KEYS.USER, currentUser)
    setStorageItem(STORAGE_KEYS.AUTH, true)

    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)

    removeStorageItem(STORAGE_KEYS.USER)
    removeStorageItem(STORAGE_KEYS.AUTH)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null

      const updated = {
        ...prev,
        ...updates,
      }

      setStorageItem(STORAGE_KEYS.USER, updated)

      return updated
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}