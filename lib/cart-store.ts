import { create } from 'zustand'

export interface CartItem {
  id: string
  creationId?: string
  menuItemId?: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  calculateTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalPrice: 0,

  addItem: (item: CartItem) => {
    const state = get()
    const existingItem = state.items.find((i) => i.id === item.id)

    if (existingItem) {
      // Update quantity if item already exists
      set({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      })
    } else {
      set({
        items: [...state.items, item],
      })
    }

    // Recalculate total
    const newState = get()
    set({
      totalPrice: newState.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    })
  },

  removeItem: (id: string) => {
    const state = get()
    set({
      items: state.items.filter((item) => item.id !== id),
    })

    // Recalculate total
    const newState = get()
    set({
      totalPrice: newState.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    })
  },

  updateQuantity: (id: string, quantity: number) => {
    const state = get()
    if (quantity <= 0) {
      set({
        items: state.items.filter((item) => item.id !== id),
      })
    } else {
      set({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      })
    }

    // Recalculate total
    const newState = get()
    set({
      totalPrice: newState.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    })
  },

  clear: () => {
    set({
      items: [],
      totalPrice: 0,
    })
  },

  calculateTotal: () => {
    const state = get()
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))
