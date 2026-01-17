'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MenuBuilderPage() {
  const [menuItems, setMenuItems] = useState<any[]>([])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Menu Builder</h1>
        <p className="text-slate-400">Create and customize your restaurant menu</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400">Menu builder interface coming soon...</p>
        <p className="text-sm text-slate-500 mt-2">
          This will allow you to create menu items and link them to available ingredients.
        </p>
      </div>
    </div>
  )
}


