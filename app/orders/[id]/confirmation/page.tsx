'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, MapPin, Package, Home } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  totalPrice: number
  status: string
  deliveryAddress: string
  paymentMethod: string
  specialInstructions?: string
  items: OrderItem[]
  createdAt: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <Link href="/" className="text-primary-400 hover:text-primary-300">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const deliveryFee = 2.99
  const estimatedDelivery = new Date(new Date().getTime() + 45 * 60000) // 45 minutes

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <CheckCircle2 size={80} className="text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-slate-400 text-lg">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Delivery Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-primary-400" />
                Delivery Address
              </h2>
              <p className="text-slate-300 text-lg">{order.deliveryAddress}</p>
            </div>

            {/* Estimated Delivery Time */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={24} className="text-primary-400" />
                Estimated Delivery
              </h2>
              <p className="text-slate-300 text-lg">
                {estimatedDelivery.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                ({estimatedDelivery.toLocaleDateString()})
              </p>
              <p className="text-slate-400 text-sm mt-2">Expected delivery in ~45 minutes</p>
            </div>

            {/* Order Items */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Package size={24} className="text-primary-400" />
                Order Items
              </h2>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between pb-3 border-b border-slate-700 last:border-0">
                    <div className="flex-grow">
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-slate-400 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-primary-400 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-2">Special Instructions</h2>
                <p className="text-slate-300">{order.specialInstructions}</p>
              </div>
            )}
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Order Status */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase">Status</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-white font-semibold capitalize">{order.status}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase">Payment</h3>
                <p className="text-white capitalize font-semibold">{order.paymentMethod}</p>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-700 space-y-2">
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
              <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total Paid</span>
                  <span className="text-3xl font-bold text-primary-400">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <Link
                  href={`/orders/${orderId}/track`}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors text-center"
                >
                  Track Order
                </Link>
                <Link
                  href="/restaurants"
                  className="block w-full border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 rounded-lg transition-colors text-center"
                >
                  Order More
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full text-slate-400 hover:text-slate-300 font-semibold py-3 transition-colors"
                >
                  <Home size={18} />
                  Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
