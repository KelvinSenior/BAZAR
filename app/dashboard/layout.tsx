'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/dashboard/inventory', label: 'Inventory' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/menu-builder', label: 'Menu Builder' },
  { href: '/dashboard/analytics', label: 'Analytics' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-6">
        <Link href="/dashboard" className="block mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            BAZAR Dashboard
          </h1>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}


