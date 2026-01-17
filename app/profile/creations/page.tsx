'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Creation {
  id: string
  name: string
  description: string | null
  image: string | null
  likesCount: number
  remixesCount: number
  createdAt: string
  restaurant: {
    id: string
    name: string
  }
}

export default function MyCreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCreations() {
      try {
        // In a real app, you'd get userId from auth
        const userId = 'temp-user-id' // Replace with actual auth
        const response = await fetch(`/api/users/${userId}/creations`)
        const data = await response.json()
        setCreations(data.creations || [])
      } catch (error) {
        console.error('Error fetching creations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreations()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your creations...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Creations</h1>
          <p className="text-slate-400">Your saved food designs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creations.map((creation, index) => (
            <motion.div
              key={creation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-primary-500 transition-all hover:scale-105"
            >
              <Link href={`/creations/${creation.id}`}>
                <div className="aspect-square bg-slate-700 relative overflow-hidden">
                  {creation.image ? (
                    <img
                      src={creation.image}
                      alt={creation.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
                      ❤️ {creation.likesCount}
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
                      🔄 {creation.remixesCount}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{creation.name}</h3>
                  {creation.description && (
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {creation.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{creation.restaurant.name}</span>
                    <Link
                      href={`/build/${creation.restaurant.id}`}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Remix →
                    </Link>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {creations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-xl mb-4">You haven't created anything yet!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
            >
              Start Building
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


