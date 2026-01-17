'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Pusher from 'pusher-js'

interface IngredientStock {
  id: string
  name: string
  stock: number
  minStock: number
  isAvailable: boolean
  category: string
}

interface InventoryTrackerProps {
  restaurantId: string
  ingredients: IngredientStock[]
  onStockUpdate?: (ingredientId: string, newStock: number) => void
  className?: string
}

export default function InventoryTracker({
  restaurantId,
  ingredients: initialIngredients,
  onStockUpdate,
  className = '',
}: InventoryTrackerProps) {
  const [ingredients, setIngredients] = useState<IngredientStock[]>(initialIngredients)
  const [lowStockItems, setLowStockItems] = useState<IngredientStock[]>([])

  // Calculate low stock items
  useEffect(() => {
    const lowStock = ingredients.filter(
      (ing) => ing.stock <= ing.minStock && ing.stock > 0
    )
    const outOfStock = ingredients.filter((ing) => ing.stock === 0)
    setLowStockItems([...lowStock, ...outOfStock])
  }, [ingredients])

  // Real-time updates via Pusher
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.warn('Pusher key not configured, using polling fallback')
      // Fallback to polling if Pusher not configured
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/inventory/${restaurantId}`)
          const data = await res.json()
          if (data.ingredients) {
            setIngredients(data.ingredients)
          }
        } catch (error) {
          console.error('Failed to fetch inventory:', error)
        }
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(interval)
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    })

    const channel = pusher.subscribe(`inventory-${restaurantId}`)

    channel.bind('stock-updated', (data: { ingredientId: string; stock: number }) => {
      setIngredients((prev) =>
        prev.map((ing) =>
          ing.id === data.ingredientId
            ? { ...ing, stock: data.stock, isAvailable: data.stock > 0 }
            : ing
        )
      )
      onStockUpdate?.(data.ingredientId, data.stock)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [restaurantId, onStockUpdate])

  const getStockStatus = (ingredient: IngredientStock) => {
    if (ingredient.stock === 0) return 'out'
    if (ingredient.stock <= ingredient.minStock) return 'low'
    return 'good'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out':
        return 'bg-red-500'
      case 'low':
        return 'bg-yellow-500'
      default:
        return 'bg-green-500'
    }
  }

  return (
    <div className={`bg-slate-800 rounded-2xl border border-slate-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Inventory Status</h2>
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          >
            {lowStockItems.length} Low Stock
          </motion.div>
        )}
      </div>

      {/* Low stock alerts */}
      <AnimatePresence>
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-2"
          >
            {lowStockItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-3 rounded-lg border-l-4 ${
                  item.stock === 0
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-yellow-900/30 border-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-slate-400">
                      {item.stock === 0
                        ? 'Out of stock'
                        : `Only ${item.stock} left (min: ${item.minStock})`}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      getStockStatus(item)
                    )} animate-pulse`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ingredients.map((ingredient) => {
          const status = getStockStatus(ingredient)
          return (
            <motion.div
              key={ingredient.id}
              layout
              className="bg-slate-700 rounded-lg p-3 border border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white truncate">{ingredient.name}</p>
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(status)} ${
                    status !== 'good' ? 'animate-pulse' : ''
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (ingredient.stock / (ingredient.minStock * 3)) * 100)}%`,
                    }}
                    className={`h-full ${getStatusColor(status)}`}
                  />
                </div>
                <span
                  className={`text-xs font-bold ${
                    status === 'out'
                      ? 'text-red-400'
                      : status === 'low'
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                >
                  {ingredient.stock}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


