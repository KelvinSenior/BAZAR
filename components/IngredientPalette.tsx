'use client'

import { useMemo, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { IngredientCategory } from '@prisma/client'

interface Ingredient {
  id: string
  name: string
  image: string
  category: IngredientCategory
  price: number
  isAvailable: boolean
  stock?: number
}

interface IngredientPaletteProps {
  ingredients: Ingredient[]
  restaurantId: string
  onIngredientSelect?: (ingredientId: string) => void
  className?: string
}

export default function IngredientPalette({
  ingredients,
  restaurantId,
  onIngredientSelect,
  className = '',
}: IngredientPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Group ingredients by category
  const categorizedIngredients = useMemo(() => {
    const filtered = ingredients.filter((ing) => {
      const matchesCategory = selectedCategory === 'ALL' || ing.category === selectedCategory
      const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

    const grouped = filtered.reduce(
      (acc, ing) => {
        if (!acc[ing.category]) {
          acc[ing.category] = []
        }
        acc[ing.category].push(ing)
        return acc
      },
      {} as Record<IngredientCategory, Ingredient[]>
    )

    return grouped
  }, [ingredients, selectedCategory, searchQuery])

  const categories: Array<IngredientCategory | 'ALL'> = [
    'ALL',
    'PROTEIN',
    'VEGETABLE',
    'CARB',
    'SAUCE',
    'CHEESE',
    'TOPPING',
    'CONDIMENT',
  ]

  return (
    <div className={`bg-slate-800 rounded-2xl border border-slate-700 p-4 ${className}`}>
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Category filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Ingredients grid */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {Object.entries(categorizedIngredients).map(([category, items]) => (
          <div key={category} className="space-y-2">
            {selectedCategory === 'ALL' && (
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide px-2">
                {category}
              </h3>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <AnimatePresence>
                {items.map((ingredient) => (
                  <DraggableIngredient
                    key={ingredient.id}
                    ingredient={ingredient}
                    onSelect={onIngredientSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {Object.keys(categorizedIngredients).length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p>No ingredients found</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Individual draggable ingredient card
function DraggableIngredient({
  ingredient,
  onSelect,
}: {
  ingredient: Ingredient
  onSelect?: (ingredientId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
    data: {
      type: 'ingredient',
      ingredient,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isDragging ? 0.5 : ingredient.isAvailable ? 1 : 0.5,
        scale: isDragging ? 0.9 : 1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect?.(ingredient.id)}
      className={`relative cursor-grab active:cursor-grabbing ${
        !ingredient.isAvailable ? 'opacity-50' : ''
      }`}
    >
      <div className="bg-slate-700 rounded-lg p-2 border border-slate-600 hover:border-primary-500 transition-colors">
        <div className="aspect-square relative mb-2">
          <img
            src={ingredient.image}
            alt={ingredient.name}
            className="w-full h-full object-cover rounded"
            draggable={false}
          />
          {/* Stock indicator */}
          {ingredient.stock !== undefined && (
            <div
              className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                ingredient.stock > 10
                  ? 'bg-green-500 text-white'
                  : ingredient.stock > 0
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {ingredient.stock}
            </div>
          )}
          {/* Unavailable overlay */}
          {!ingredient.isAvailable && (
            <div className="absolute inset-0 bg-slate-900/70 rounded flex items-center justify-center">
              <span className="text-xs text-red-400 font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <p className="text-xs text-white font-medium truncate">{ingredient.name}</p>
        <p className="text-xs text-slate-400">${ingredient.price.toFixed(2)}</p>
      </div>
    </motion.div>
  )
}


