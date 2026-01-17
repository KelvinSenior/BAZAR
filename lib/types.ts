import { IngredientCategory, OrderStatus, UserRole } from '@prisma/client'

export type { IngredientCategory, OrderStatus, UserRole }

export interface IngredientPosition {
  x: number
  y: number
  z: number
  rotation: number
}

export interface GameInteractionData {
  grillTiming?: {
    startTime: number
    endTime: number
    perfectTiming: boolean
  }
  sauceMixing?: {
    accuracy: number
    timeTaken: number
  }
  assemblyOrder?: string[] // Array of ingredient IDs in order added
  totalTime?: number
}

export interface CreationState {
  ingredients: Array<{
    id: string
    ingredientId: string
    name: string
    image: string
    position: IngredientPosition
    quantity: number
  }>
  history: Array<{
    ingredients: CreationState['ingredients']
    timestamp: number
  }>
  historyIndex: number
}


