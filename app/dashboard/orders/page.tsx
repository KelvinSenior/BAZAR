'use client'

import { useSearchParams } from 'next/navigation'
import KitchenView from '@/components/KitchenView'

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('restaurantId') || 'temp-restaurant-id'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Order Management</h1>
        <p className="text-slate-400">Monitor and manage incoming orders in real-time</p>
      </div>

      <KitchenView restaurantId={restaurantId} />
    </div>
  )
}


