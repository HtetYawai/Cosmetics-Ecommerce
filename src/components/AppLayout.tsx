import type { ReactNode } from 'react'
import BottomNav from './BottomNav'

interface AppLayoutProps {
  children: ReactNode
  showNav?: boolean
  className?: string
}

export default function AppLayout({ children, showNav = true, className = '' }: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className={`mx-auto max-w-lg ${showNav ? 'pb-20' : ''}`}>{children}</div>
      {showNav && <BottomNav />}
    </div>
  )
}
