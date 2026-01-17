'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface CreationCardProps {
  id: string
  name: string
  description: string | null
  image: string | null
  likesCount: number
  remixesCount: number
  user: {
    name: string | null
    image: string | null
  }
  restaurant: {
    name: string
  }
  index?: number
}

export default function CreationCard({
  id,
  name,
  description,
  image,
  likesCount,
  remixesCount,
  user,
  restaurant,
  index = 0,
}: CreationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-primary-500 transition-all hover:scale-105"
    >
      <Link href={`/creations/${id}`}>
        <div className="aspect-square bg-slate-700 relative overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
              ❤️ {likesCount}
            </div>
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
              🔄 {remixesCount}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
          {description && (
            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm text-slate-300">{user.name || 'Anonymous'}</span>
            </div>
            <span className="text-xs text-slate-400">{restaurant.name}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}


