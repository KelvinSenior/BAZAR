'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useBuilderStore } from '@/lib/store'

interface CartItem {
  id: string
  creationId: string
  creationName: string
  restaurantId: string
  restaurantName: string
  quantity: number
  price: number
  ingredients: string[]
}

export default function CartPage() {
  const router = useRouter()
  const { creation } = useBuilderStore()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('bazar_cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setLoading(false)
  }, [])

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      const updated = cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      setCartItems(updated)
      localStorage.setItem('bazar_cart', JSON.stringify(updated))
    }
  }

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id)
    setCartItems(updated)
    localStorage.setItem('bazar_cart', JSON.stringify(updated))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const deliveryFee = subtotal > 0 ? 2.99 : 0
  const total = subtotal + tax + deliveryFee

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <Link
            href="/restaurants"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-4xl font-bold text-white">Your Cart</h1>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl">⏳</div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center"
          >
            <ShoppingBag size={48} className="mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-400 mb-6">Start browsing restaurants to add items</p>
            <Link
              href="/restaurants"
              className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Restaurants
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-primary-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-1">{item.creationName}</h3>
                      <p className="text-slate-400 text-sm">{item.restaurantName}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {item.ingredients.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-900 rounded-lg">
                      <p className="text-xs text-slate-400 mb-2">Ingredients:</p>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {item.ingredients.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Minus size={18} className="text-white" />
                      </button>
                      <span className="text-white font-semibold min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Plus size={18} className="text-white" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">
                        ${item.price.toFixed(2)} each
                      </p>
                      <p className="text-lg font-bold text-primary-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                {/* Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-3xl font-bold text-primary-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors text-center"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/restaurants"
                  className="block w-full mt-3 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 rounded-lg transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
