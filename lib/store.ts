import { create } from 'zustand'
import { CreationState, IngredientPosition } from './types'

interface BuilderStore {
  creation: CreationState
  setCreation: (creation: CreationState) => void
  addIngredient: (ingredient: {
    id: string
    ingredientId: string
    name: string
    image: string
    position: IngredientPosition
    quantity: number
  }) => void
  removeIngredient: (id: string) => void
  updateIngredientPosition: (id: string, position: Partial<IngredientPosition>) => void
  undo: () => void
  redo: () => void
  clear: () => void
  canUndo: boolean
  canRedo: boolean
}

const initialState: CreationState = {
  ingredients: [],
  history: [{ ingredients: [], timestamp: Date.now() }],
  historyIndex: 0,
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  creation: initialState,
  canUndo: false,
  canRedo: false,

  setCreation: (creation) => set({ creation }),

  addIngredient: (ingredient) => {
    const state = get()
    const newIngredients = [...state.creation.ingredients, ingredient]
    const newHistory = state.creation.history.slice(0, state.creation.historyIndex + 1)
    newHistory.push({
      ingredients: newIngredients,
      timestamp: Date.now(),
    })

    set({
      creation: {
        ingredients: newIngredients,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      },
      canUndo: true,
      canRedo: false,
    })
  },

  removeIngredient: (id) => {
    const state = get()
    const newIngredients = state.creation.ingredients.filter((ing) => ing.id !== id)
    const newHistory = state.creation.history.slice(0, state.creation.historyIndex + 1)
    newHistory.push({
      ingredients: newIngredients,
      timestamp: Date.now(),
    })

    set({
      creation: {
        ingredients: newIngredients,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      },
      canUndo: true,
      canRedo: false,
    })
  },

  updateIngredientPosition: (id, position) => {
    const state = get()
    const newIngredients = state.creation.ingredients.map((ing) =>
      ing.id === id
        ? {
            ...ing,
            position: { ...ing.position, ...position },
          }
        : ing
    )

    set({
      creation: {
        ...state.creation,
        ingredients: newIngredients,
      },
    })
  },

  undo: () => {
    const state = get()
    if (state.creation.historyIndex > 0) {
      const newIndex = state.creation.historyIndex - 1
      set({
        creation: {
          ...state.creation,
          ingredients: state.creation.history[newIndex].ingredients,
          historyIndex: newIndex,
        },
        canUndo: newIndex > 0,
        canRedo: true,
      })
    }
  },

  redo: () => {
    const state = get()
    if (state.creation.historyIndex < state.creation.history.length - 1) {
      const newIndex = state.creation.historyIndex + 1
      set({
        creation: {
          ...state.creation,
          ingredients: state.creation.history[newIndex].ingredients,
          historyIndex: newIndex,
        },
        canUndo: true,
        canRedo: newIndex < state.creation.history.length - 1,
      })
    }
  },

  clear: () => set({ creation: initialState, canUndo: false, canRedo: false }),
}))


