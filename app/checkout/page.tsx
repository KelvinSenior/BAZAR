'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Zap } from 'lucide-react'

interface CartItem {
  id: string
  creationName: string
  restaurantName: string
  quantity: number
  price: number
}

interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  paymentMethod: 'card' | 'wallet' | 'cash'
  specialInstructions: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card',
    specialInstructions: '',
  })

  useEffect(() => {
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const deliveryFee = subtotal > 0 ? 2.99 : 0
  const total = subtotal + tax + deliveryFee

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          deliveryAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          },
          paymentMethod: formData.paymentMethod,
          specialInstructions: formData.specialInstructions,
          total,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to place order'}`)
        return
      }

      const order = await response.json()
      localStorage.removeItem('bazar_cart')
      router.push(`/orders/${order.id}/confirmation`)
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <Link
              href="/restaurants"
              className="inline-block px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg"
            >
              Back to Restaurants
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
            href="/cart"
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-4xl font-bold text-white">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >
            {/* Delivery Address */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-primary-400" />
                Delivery Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="col-span-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="col-span-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="col-span-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="col-span-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="col-span-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={24} className="text-primary-400" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {['card', 'wallet', 'cash'].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 p-4 border border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-white font-semibold capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Special Instructions</h2>
              <textarea
                name="specialInstructions"
                placeholder="Add delivery instructions, dietary preferences, etc."
                value={formData.specialInstructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 text-white font-bold py-4 rounded-lg transition-colors"
            >
              {submitting ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
            </motion.button>
          </motion.form>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-4">Order Items</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-grow">
                      <p className="text-white font-semibold">{item.creationName}</p>
                      <p className="text-slate-400 text-xs">x{item.quantity}</p>
                    </div>
                    <p className="text-primary-400 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
