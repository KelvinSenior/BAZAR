'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, MapPin, Plus, ShoppingCart, Zap } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
  image?: string
  rating?: number
  preparationTime?: number
}

interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  address: string
  phone: string
  rating?: number
}

interface GroupedMenuItems {
  [category: string]: MenuItem[]
}

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [groupedItems, setGroupedItems] = useState<GroupedMenuItems>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch restaurant
        const restaurantRes = await fetch(`/api/restaurants/${restaurantId}`)
        const restaurantData = await restaurantRes.json()
        setRestaurant(restaurantData.restaurant)

        // Fetch menu items
        const menuRes = await fetch(`/api/restaurants/${restaurantId}/menu`)
        const menuData = await menuRes.json()
        setMenuItems(menuData.items || [])

        // Group by category
        const grouped = (menuData.items || []).reduce((acc: GroupedMenuItems, item: MenuItem) => {
          if (!acc[item.category]) {
            acc[item.category] = []
          }
          acc[item.category].push(item)
          return acc
        }, {})
        setGroupedItems(grouped)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [restaurantId])

  const categories = Object.keys(groupedItems).sort()
  const displayedItems =
    selectedCategory === 'ALL'
      ? menuItems
      : groupedItems[selectedCategory] || []

  const addToCart = (item: MenuItem) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      creationId: item.id,
      creationName: item.name,
      restaurantId: restaurantId,
      restaurantName: restaurant?.name || 'Unknown',
      quantity: 1,
      price: item.basePrice,
      ingredients: [item.description],
    }

    const cart = JSON.parse(localStorage.getItem('bazar_cart') || '[]')
    cart.push(cartItem)
    localStorage.setItem('bazar_cart', JSON.stringify(cart))

    setAddedToCart(item.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Restaurants
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin text-4xl">⏳</div>
          <p className="text-slate-300 mt-4">Loading restaurant...</p>
        </div>
      ) : !restaurant ? (
        <div className="text-center py-20">
          <p className="text-slate-400">Restaurant not found</p>
        </div>
      ) : (
        <>
          {/* Restaurant Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 mb-12"
          >
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-6">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-slate-300 text-lg line-clamp-2">{restaurant.description}</p>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                <MapPin className="text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">Address</p>
                  <p className="text-white font-semibold">{restaurant.address}</p>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                <span className="text-2xl">☎️</span>
                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{restaurant.phone}</p>
                </div>
              </div>
              {restaurant.rating && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                  <Star className="text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Rating</p>
                    <p className="text-white font-semibold">{restaurant.rating.toFixed(1)} / 5</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Menu Section */}
          <div className="container mx-auto px-4 pb-12">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Our Menu</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedCategory === 'ALL'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Menu Items Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-primary-500 transition-all group h-full flex flex-col"
                >
                  {/* Item Image */}
                  {item.image && (
                    <div className="h-48 bg-slate-700 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-primary-400 text-sm">
                          <Star size={14} />
                          {item.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm mb-3 flex-grow line-clamp-2">
                      {item.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                      <span className="text-primary-400 font-bold text-lg">
                        ${item.basePrice.toFixed(2)}
                      </span>
                      {item.preparationTime && (
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {item.preparationTime}m
                        </span>
                      )}
                    </div>

                    {/* Add Button */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(item)}
                        className={`w-full font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                          addedToCart === item.id
                            ? 'bg-green-500 text-white'
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                        }`}
                      >
                        <ShoppingCart size={18} />
                        {addedToCart === item.id ? 'Added!' : 'Add'}
                      </motion.button>
                      <Link
                        href={`/build/${restaurantId}?menuItem=${item.id}`}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap size={18} />
                        Build
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {displayedItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-slate-400">No items in this category</p>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
