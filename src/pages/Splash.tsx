import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Splash() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/home' : '/login', { replace: true })
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 via-pink-100 to-pink-200">
      <div className="animate-pulse text-center">
        <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-pink-400 shadow-xl">
            <span className="font-serif text-5xl font-bold text-white">G</span>
          </div>
        </div>
        <h1 className="font-serif text-4xl font-bold">
          <span className="bg-gradient-to-r from-brand to-pink-400 bg-clip-text text-transparent">
            Glow
          </span>
          <span className="text-gray-400">Up</span>
        </h1>
        <p className="mt-1 tracking-[0.3em] text-sm font-medium text-gray-500">BEAUTY</p>
        <p className="mt-4 text-sm text-gray-500">Glow with confidence, shine every day.</p>
        <div className="mt-8 flex items-center justify-center gap-1 text-brand">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <Sparkles className="h-3 w-3 animate-pulse delay-100" />
          <Sparkles className="h-4 w-4 animate-pulse delay-200" />
        </div>
      </div>
    </div>
  )
}
