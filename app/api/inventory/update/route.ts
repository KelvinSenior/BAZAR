import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import Pusher from 'pusher'

const updateInventorySchema = z.object({
  restaurantId: z.string(),
  ingredientId: z.string(),
  stock: z.number().int().min(0),
})

// Initialize Pusher server instance
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'us2',
  useTLS: true,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateInventorySchema.parse(body)

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: validatedData.restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Update ingredient stock
    const ingredient = await prisma.ingredient.update({
      where: {
        id: validatedData.ingredientId,
        restaurantId: validatedData.restaurantId,
      },
      data: {
        stock: validatedData.stock,
        isAvailable: validatedData.stock > 0,
        updatedAt: new Date(),
      },
    })

    // Broadcast real-time update via Pusher
    try {
      await pusher.trigger(`inventory-${validatedData.restaurantId}`, 'stock-updated', {
        ingredientId: ingredient.id,
        stock: ingredient.stock,
        isAvailable: ingredient.isAvailable,
        minStock: ingredient.minStock,
      })
    } catch (pusherError) {
      console.error('Pusher error (non-critical):', pusherError)
      // Continue even if Pusher fails
    }

    return NextResponse.json(
      {
        success: true,
        ingredient,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch current inventory
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const restaurantId = searchParams.get('restaurantId')

    if (!restaurantId) {
      return NextResponse.json({ error: 'restaurantId is required' }, { status: 400 })
    }

    const ingredients = await prisma.ingredient.findMany({
      where: {
        restaurantId,
      },
      orderBy: [
        { isAvailable: 'desc' },
        { category: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ ingredients }, { status: 200 })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}


