'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import InventoryTracker from '@/components/InventoryTracker'
import { motion } from 'framer-motion'

interface Ingredient {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  isAvailable: boolean
}

export default function InventoryPage() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('restaurantId') || 'temp-restaurant-id'
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState(0)

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch(`/api/inventory/${restaurantId}`)
        const data = await response.json()
        setIngredients(data.ingredients || [])
      } catch (error) {
        console.error('Error fetching inventory:', error)
      }
    }

    fetchInventory()
  }, [restaurantId])

  const handleUpdateStock = async (ingredientId: string, newStock: number) => {
    try {
      const response = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          ingredientId,
          stock: newStock,
        }),
      })

      if (response.ok) {
        setIngredients((prev) =>
          prev.map((ing) =>
            ing.id === ingredientId
              ? { ...ing, stock: newStock, isAvailable: newStock > 0 }
              : ing
          )
        )
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Inventory Management</h1>
        <p className="text-slate-400">Track and update ingredient stock in real-time</p>
      </div>

      <InventoryTracker restaurantId={restaurantId} ingredients={ingredients} />

      {/* Detailed inventory table */}
      <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">All Ingredients</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Min Stock</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Price</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient) => (
                  <motion.tr
                    key={ingredient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-4 text-white">{ingredient.name}</td>
                    <td className="py-3 px-4 text-slate-400">{ingredient.category}</td>
                    <td className="py-3 px-4">
                      {editingId === ingredient.id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`font-semibold ${
                            ingredient.stock <= ingredient.minStock
                              ? 'text-yellow-400'
                              : ingredient.stock === 0
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}
                        >
                          {ingredient.stock}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{ingredient.minStock}</td>
                    <td className="py-3 px-4 text-slate-400">${ingredient.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {editingId === ingredient.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStock(ingredient.id, editStock)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(ingredient.id)
                            setEditStock(ingredient.stock)
                          }}
                          className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


