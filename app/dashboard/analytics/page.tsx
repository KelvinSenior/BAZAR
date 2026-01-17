'use client'

import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Insights into customer customization patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary-400">0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Most Popular Ingredient</h3>
          <p className="text-3xl font-bold text-primary-400">-</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-primary-400">$0.00</p>
        </motion.div>
      </div>

      <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Customization Insights</h2>
        <p className="text-slate-400">Analytics dashboard coming soon...</p>
      </div>
    </div>
  )
}


