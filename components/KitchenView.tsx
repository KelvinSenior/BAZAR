'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Pusher from 'pusher-js'
import { OrderStatus } from '@prisma/client'

interface Order {
  id: string
  status: OrderStatus
  totalPrice: number
  createdAt: string
  user: {
    name: string | null
  }
  creation: {
    name: string
    ingredients: Array<{
      ingredient: {
        name: string
        image: string | null
      }
      quantity: number
    }>
  } | null
}

interface KitchenViewProps {
  restaurantId: string
}

export default function KitchenView({ restaurantId }: KitchenViewProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/dashboard/orders?restaurantId=${restaurantId}`)
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()

    // Real-time updates
    if (process.env.NEXT_PUBLIC_PUSHER_KEY) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
      })

      const channel = pusher.subscribe(`restaurant-${restaurantId}`)

      channel.bind('order-updated', () => {
        fetchOrders()
      })

      return () => {
        channel.unbind_all()
        channel.unsubscribe()
        pusher.disconnect()
      }
    }
  }, [restaurantId])

  const filteredOrders = orders.filter(
    (order) => filter === 'ALL' || order.status === filter
  )

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch('/api/orders/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        )
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500'
      case 'CONFIRMED':
        return 'bg-blue-500'
      case 'PREPARING':
        return 'bg-orange-500'
      case 'ASSEMBLING':
        return 'bg-purple-500'
      case 'READY':
        return 'bg-green-500'
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-500'
      case 'DELIVERED':
        return 'bg-slate-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'ASSEMBLING', 'READY'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={updateOrderStatus}
              getStatusColor={getStatusColor}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-xl">No orders found</p>
        </div>
      )}
    </div>
  )
}

function OrderCard({
  order,
  onStatusUpdate,
  getStatusColor,
}: {
  order: Order
  onStatusUpdate: (orderId: string, status: OrderStatus) => void
  getStatusColor: (status: OrderStatus) => string
}) {
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PREPARING',
      PREPARING: 'ASSEMBLING',
      ASSEMBLING: 'READY',
      READY: 'OUT_FOR_DELIVERY',
      OUT_FOR_DELIVERY: 'DELIVERED',
      DELIVERED: null,
      CANCELLED: null,
    }
    return statusFlow[currentStatus] || null
  }

  const nextStatus = getNextStatus(order.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-800 rounded-xl p-4 border border-slate-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400">Order #{order.id.slice(0, 8)}</p>
          <p className="text-white font-semibold">{order.user.name || 'Guest'}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(order.status)}`}>
          {order.status}
        </div>
      </div>

      {order.creation && (
        <div className="mb-4">
          <p className="text-white font-medium mb-2">{order.creation.name}</p>
          <div className="flex flex-wrap gap-2">
            {order.creation.ingredients.slice(0, 5).map((item, index) => (
              <div key={index} className="text-xs text-slate-400">
                {item.ingredient.name} x{item.quantity}
              </div>
            ))}
            {order.creation.ingredients.length > 5 && (
              <div className="text-xs text-slate-400">
                +{order.creation.ingredients.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-white">${order.totalPrice.toFixed(2)}</p>
        {nextStatus && (
          <button
            onClick={() => onStatusUpdate(order.id, nextStatus)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Mark as {nextStatus.replace('_', ' ')}
          </button>
        )}
      </div>
    </motion.div>
  )
}


