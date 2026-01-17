'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import FoodBuilderCanvas from '@/components/FoodBuilderCanvas'
import IngredientPalette from '@/components/IngredientPalette'
import PlatePreview3D from '@/components/PlatePreview3D'
import InventoryTracker from '@/components/InventoryTracker'
import { useBuilderStore } from '@/lib/store'

export default function BuildPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.restaurantId as string
  const { creation, addIngredient, removeIngredient, clear, canUndo, canRedo, undo, redo } =
    useBuilderStore()

  const [ingredients, setIngredients] = useState<any[]>([])
  const [restaurant, setRestaurant] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [creationName, setCreationName] = useState('')
  const [creationDescription, setCreationDescription] = useState('')

  // Fetch restaurant and ingredients
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch restaurant
        const restaurantRes = await fetch(`/api/restaurants/${restaurantId}`)
        const restaurantData = await restaurantRes.json()
        setRestaurant(restaurantData.restaurant)

        // Fetch ingredients
        const ingredientsRes = await fetch(`/api/inventory/${restaurantId}`)
        const ingredientsData = await ingredientsRes.json()
        setIngredients(ingredientsData.ingredients)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (restaurantId) {
      fetchData()
    }
  }, [restaurantId])

  const handleIngredientDrop = async (ingredientId: string, position: { x: number; y: number }) => {
    const ingredient = ingredients.find((ing) => ing.id === ingredientId)
    if (!ingredient || !ingredient.isAvailable) {
      alert('This ingredient is not available')
      return
    }

    addIngredient({
      id: `${ingredientId}-${Date.now()}`,
      ingredientId: ingredient.id,
      name: ingredient.name,
      image: ingredient.image || '/placeholder-ingredient.png',
      position: {
        x: position.x,
        y: position.y,
        z: 0,
        rotation: Math.random() * 360,
      },
      quantity: 1,
    })
  }

  const handleIngredientRemove = (id: string) => {
    removeIngredient(id)
  }

  const handleIngredientMove = (id: string, position: { x: number; y: number }) => {
    // Position update is handled by the store
  }

  const handleSave = async () => {
    if (!creationName.trim()) {
      alert('Please enter a name for your creation')
      return
    }

    setIsSaving(true)
    try {
      // In a real app, you'd get userId from auth
      const userId = 'temp-user-id' // Replace with actual auth

      const response = await fetch('/api/game/save-creation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: creationName,
          description: creationDescription,
          userId,
          restaurantId,
          ingredients: creation.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            positionX: ing.position.x,
            positionY: ing.position.y,
            positionZ: ing.position.z,
            rotation: ing.position.rotation,
          })),
          isPublic: false,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/profile/creations`)
      } else {
        const error = await response.json()
        alert(`Failed to save: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving creation:', error)
      alert('Failed to save creation')
    } finally {
      setIsSaving(false)
      setShowSaveModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {restaurant?.name || 'Building Your Meal'}
            </h1>
            <p className="text-slate-400">Drag and drop ingredients to build your creation</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Redo
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={creation.ingredients.length === 0}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Ingredient Palette */}
          <div className="lg:col-span-1">
            <IngredientPalette
              ingredients={ingredients}
              restaurantId={restaurantId}
            />
          </div>

          {/* Center: Builder Canvas */}
          <div className="lg:col-span-1">
            <FoodBuilderCanvas
              ingredients={ingredients}
              onIngredientDrop={handleIngredientDrop}
              onIngredientRemove={handleIngredientRemove}
              onIngredientMove={handleIngredientMove}
              className="h-[600px]"
            />
          </div>

          {/* Right: 3D Preview & Inventory */}
          <div className="lg:col-span-1 space-y-6">
            <PlatePreview3D className="h-[300px]" />
            <InventoryTracker restaurantId={restaurantId} ingredients={ingredients} />
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Save Your Creation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={creationName}
                  onChange={(e) => setCreationName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="My Awesome Burger"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={creationDescription}
                  onChange={(e) => setCreationDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="A delicious combination of..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !creationName.trim()}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}


