'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Clock, MapPin } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  address: string
  phone: string
  rating?: number
  preparationTime?: number
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'name'>('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch('/api/restaurants/list')
        const data = await res.json()
        setRestaurants(data.restaurants || [])
        setFilteredRestaurants(data.restaurants || [])
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Filter and sort restaurants
  useEffect(() => {
    let filtered = restaurants.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      } else if (sortBy === 'time') {
        return (a.preparationTime || 0) - (b.preparationTime || 0)
      } else {
        return a.name.localeCompare(b.name)
      }
    })

    setFilteredRestaurants(filtered)
  }, [searchQuery, sortBy, restaurants])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Discover Restaurants
          </h1>
          <p className="text-slate-300 text-lg">
            Browse all available restaurants and start building your perfect meal
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants by name or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <span className="absolute right-4 top-3 text-slate-400">🔍</span>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sortBy === 'rating'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ⭐ Top Rated
            </button>
            <button
              onClick={() => setSortBy('time')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sortBy === 'time'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ⏱️ Fastest
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sortBy === 'name'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              A-Z
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 mb-6"
        >
          Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-slate-300 mt-4">Loading restaurants...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center"
          >
            <p className="text-slate-400 text-lg mb-2">No restaurants found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRestaurants.map((restaurant) => (
              <motion.div key={restaurant.id} variants={itemVariants}>
                <Link href={`/restaurants/${restaurant.id}`}>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 bg-slate-700 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {restaurant.rating && (
                        <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                          <Star size={16} />
                          <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {restaurant.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-2">
                        {restaurant.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 border-t border-slate-700 pt-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span className="line-clamp-1">{restaurant.address}</span>
                        </div>
                        {restaurant.preparationTime && (
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock size={16} />
                            <span>{restaurant.preparationTime} min avg</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <button className="mt-4 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg transition-colors">
                        View Menu →
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
