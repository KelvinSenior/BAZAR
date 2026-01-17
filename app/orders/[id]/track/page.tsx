'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Bike, Phone, CheckCircle2 } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  deliveryAddress: string
  paymentMethod: string
  items: OrderItem[]
  createdAt: string
}

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: '📦', description: 'Your order has been received' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '✅', description: 'Restaurant confirmed your order' },
  { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳', description: 'Your food is being prepared' },
  { key: 'READY', label: 'Ready', icon: '✨', description: 'Your order is ready for pickup' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the way', icon: '🚴', description: 'Delivery agent is coming' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🎉', description: 'Your order has been delivered' },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(true)

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

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      if (polling) {
        fetchOrder()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId, polling])

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

  const currentStepIndex = STATUS_STEPS.findIndex((step) => step.key === order.status)
  const isDelivered = order.status === 'DELIVERED'
  const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 45 * 60000)

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
          <h1 className="text-4xl font-bold text-white">Track Order</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Status Banner */}
            {isDelivered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center"
              >
                <CheckCircle2 size={48} className="mx-auto mb-3 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400 mb-2">Order Delivered!</h2>
                <p className="text-green-300">Thanks for your order. We hope you enjoyed your meal!</p>
              </motion.div>
            )}

            {/* Timeline */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-8">Order Progress</h2>

              <div className="space-y-6">
                {STATUS_STEPS.map((step, index) => {
                  const isActive = index <= currentStepIndex
                  const isCurrentStep = index === currentStepIndex

                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex gap-4">
                        {/* Timeline Circle */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={isCurrentStep ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 1, repeat: isCurrentStep ? Infinity : 0 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                              isActive
                                ? 'bg-primary-500/20 border-primary-400 text-primary-400'
                                : 'bg-slate-900 border-slate-600 text-slate-400'
                            }`}
                          >
                            {step.icon}
                          </motion.div>

                          {/* Timeline Line */}
                          {index < STATUS_STEPS.length - 1 && (
                            <div
                              className={`w-1 h-16 mt-2 ${
                                isActive ? 'bg-primary-400' : 'bg-slate-700'
                              }`}
                            />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="pb-4 flex-grow pt-1">
                          <h3
                            className={`text-lg font-bold ${
                              isActive ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p
                            className={`text-sm ${
                              isActive ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>

                        {/* Checkmark */}
                        {index < currentStepIndex && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="pt-1"
                          >
                            <CheckCircle2 size={24} className="text-green-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Delivery Time Estimate */}
            {!isDelivered && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
                <Clock size={32} className="text-primary-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Estimated Delivery</h3>
                  <p className="text-slate-400">
                    Expected by{' '}
                    <span className="text-primary-400 font-semibold">
                      {estimatedDelivery.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Delivery Address */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-primary-400" />
                Delivery To
              </h3>
              <p className="text-slate-300">{order.deliveryAddress}</p>
            </div>

            {/* Order Items Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {item.name} <span className="text-slate-500">x{item.quantity}</span>
                    </span>
                    <span className="text-primary-400 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Order Total</span>
                <span className="text-2xl font-bold text-primary-400">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isDelivered && (
                <>
                  <Link
                    href="/restaurants"
                    className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors text-center"
                  >
                    Order Again
                  </Link>
                  <Link
                    href="/"
                    className="block w-full border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 rounded-lg transition-colors text-center"
                  >
                    Back Home
                  </Link>
                </>
              )}

              {!isDelivered && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-400 mb-2">Need help?</p>
                  <button className="flex items-center justify-center gap-2 w-full text-primary-400 hover:text-primary-300 font-semibold">
                    <Phone size={16} />
                    Contact Support
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
