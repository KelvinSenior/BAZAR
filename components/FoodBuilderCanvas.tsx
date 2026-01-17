'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuilderStore } from '@/lib/store'
import { IngredientPosition } from '@/lib/types'

interface Ingredient {
  id: string
  ingredientId: string
  name: string
  image: string
  position: IngredientPosition
  quantity: number
}

interface FoodBuilderCanvasProps {
  ingredients: Array<{
    id: string
    name: string
    image: string
    category: string
    isAvailable: boolean
  }>
  onIngredientDrop: (ingredientId: string, position: { x: number; y: number }) => void
  onIngredientRemove: (id: string) => void
  onIngredientMove: (id: string, position: { x: number; y: number }) => void
  className?: string
}

export default function FoodBuilderCanvas({
  ingredients,
  onIngredientDrop,
  onIngredientRemove,
  onIngredientMove,
  className = '',
}: FoodBuilderCanvasProps) {
  const { creation, updateIngredientPosition, removeIngredient } = useBuilderStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Calculate drop position relative to canvas
  const getDropPosition = useCallback(
    (event: DragEndEvent): { x: number; y: number } | null => {
      if (!canvasRef.current || !event.over) return null

      const rect = canvasRef.current.getBoundingClientRect()
      const x = ((event.over.rect.left - rect.left) / rect.width) * 100
      const y = ((event.over.rect.top - rect.top) / rect.height) * 100

      return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
    },
    []
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setIsDragging(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false)
    setActiveId(null)

    if (!over) return

    // Check if dropping an ingredient from palette onto canvas
    if (active.data.current?.type === 'ingredient' && over.id === 'canvas') {
      const position = getDropPosition(event)
      if (position) {
        onIngredientDrop(active.id as string, position)
      }
      return
    }

    // Check if moving an existing ingredient on canvas
    if (active.data.current?.type === 'placed-ingredient' && over.id === 'canvas') {
      const position = getDropPosition(event)
      if (position) {
        const ingredient = creation.ingredients.find((ing) => ing.id === active.id)
        if (ingredient) {
          updateIngredientPosition(ingredient.id, {
            x: position.x,
            y: position.y,
            z: ingredient.position.z,
            rotation: ingredient.position.rotation,
          })
          onIngredientMove(ingredient.id, position)
        }
      }
    }
  }

  const handleIngredientClick = (ingredient: Ingredient) => {
    // Double-click to remove (or show remove button)
    // For now, we'll use a simple click handler
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3">
        {/* Canvas Label */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/30 rounded-lg">
          <h2 className="text-sm font-bold text-white mb-1">🍽️ Drop Zone</h2>
          <p className="text-xs text-slate-300">Drop ingredients here to place them on your creation</p>
        </div>
        
        {/* Canvas */}
      <div
        ref={canvasRef}
        id="canvas"
        className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 ${isDragging ? 'border-primary-500 bg-slate-800/80' : 'border-dashed border-slate-600'} overflow-hidden transition-all ${className}`}
      >
        {/* Grid pattern background for visual reference */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Placed ingredients */}
        <AnimatePresence>
          {creation.ingredients.map((ingredient) => (
            <PlacedIngredient
              key={ingredient.id}
              ingredient={ingredient}
              onRemove={() => {
                removeIngredient(ingredient.id)
                onIngredientRemove(ingredient.id)
              }}
              isDragging={activeId === ingredient.id}
            />
          ))}
        </AnimatePresence>

        {/* Empty state message */}
        {creation.ingredients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="text-slate-400 text-lg font-semibold mb-2">Drag ingredients here</p>
              <p className="text-slate-500 text-sm">👈 Select from palette on the left</p>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Drop zone indicator */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-4 border-dashed border-primary-500 rounded-2xl pointer-events-none"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-primary-400 text-lg font-semibold"
              >
                Drop ingredient here
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {creation.ingredients.length === 0 && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center text-slate-400">
              <p className="text-xl mb-2">Start building your meal!</p>
              <p className="text-sm">Drag ingredients from the palette</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Drag overlay - shows ingredient being dragged */}
      <DragOverlay>
        {activeId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <DraggedIngredientOverlay
              ingredient={
                creation.ingredients.find((ing) => ing.id === activeId) ||
                ingredients.find((ing) => ing.id === activeId)
              }
            />
            <div className="bg-primary-500 px-3 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap shadow-lg">
              ✋ Drop it here!
            </div>
          </motion.div>
        )}
      </DragOverlay>
      </div>
    </DndContext>
  )
}

// Component for placed ingredients on canvas
function PlacedIngredient({
  ingredient,
  onRemove,
  isDragging,
}: {
  ingredient: Ingredient
  onRemove: () => void
  isDragging: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.9 : 1,
        x: `${ingredient.position.x}%`,
        y: `${ingredient.position.y}%`,
        rotate: ingredient.position.rotation || 0,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      className="absolute cursor-move group"
      style={{
        transform: `translate(-50%, -50%) rotate(${ingredient.position.rotation || 0}deg)`,
      }}
      data-type="placed-ingredient"
      data-id={ingredient.id}
    >
      <div className="relative">
        <img
          src={ingredient.image}
          alt={ingredient.name}
          className="w-20 h-20 object-cover rounded-lg shadow-lg border-2 border-white/20"
          draggable={false}
        />
        {/* Remove button on hover */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20"
        >
          ×
        </motion.button>
        {/* Ingredient name tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
        >
          {ingredient.name}
        </motion.div>
      </div>
    </motion.div>
  )
}

// Overlay component shown while dragging
function DraggedIngredientOverlay({
  ingredient,
}: {
  ingredient?: Ingredient | { id: string; name: string; image: string }
}) {
  if (!ingredient) return null

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-24 h-24"
    >
      <img
        src={ingredient.image}
        alt={ingredient.name}
        className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-primary-500"
        draggable={false}
      />
    </motion.div>
  )
}


