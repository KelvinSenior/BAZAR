'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Pusher from 'pusher-js'

interface Order {
  id: string
  status: string
  totalPrice: number
  createdAt: string
  creation: {
    id: string
    name: string
    ingredients: Array<{
      ingredient: {
        id: string
        name: string
        image: string | null
      }
      quantity: number
    }>
  }
  restaurant: {
    id: string
    name: string
  }
}

const statusSteps = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'ASSEMBLING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export default function LiveOrderPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/live?orderId=${orderId}`)
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  // Real-time order updates
  useEffect(() => {
    if (!orderId || !process.env.NEXT_PUBLIC_PUSHER_KEY) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    })

    const channel = pusher.subscribe(`order-${orderId}`)

    channel.bind('status-updated', (data: { status: string }) => {
      setOrder((prev) => (prev ? { ...prev, status: data.status } : null))
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading order...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Order not found</div>
      </div>
    )
  }

  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-slate-400">{order.restaurant.name}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Order Status</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCompleted
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-primary-500/50' : ''}`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCompleted ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {step.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">{order.creation.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {order.creation.ingredients.map((item, index) => (
              <motion.div
                key={item.ingredient.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                {item.ingredient.image && (
                  <img
                    src={item.ingredient.image}
                    alt={item.ingredient.name}
                    className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                  />
                )}
                <p className="text-sm text-white font-medium">{item.ingredient.name}</p>
                <p className="text-xs text-slate-400">x{item.quantity}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total</span>
              <span className="text-2xl font-bold text-white">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


