import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import Pusher from 'pusher'

const updateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'ASSEMBLING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  gameData: z.record(z.any()).optional(),
})

// Initialize Pusher server instance
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'us2',
  useTLS: true,
})

// GET endpoint - fetch order details
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        creation: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// POST endpoint - update order status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateOrderStatusSchema.parse(body)

    const order = await prisma.order.update({
      where: { id: validatedData.orderId },
      data: {
        status: validatedData.status,
        gameData: validatedData.gameData || undefined,
        updatedAt: new Date(),
        ...(validatedData.status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(validatedData.status === 'DELIVERED' && { deliveredAt: new Date() }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Broadcast real-time update via Pusher
    try {
      await pusher.trigger(`order-${validatedData.orderId}`, 'status-updated', {
        orderId: order.id,
        status: order.status,
        updatedAt: order.updatedAt,
      })

      // Also broadcast to restaurant channel
      await pusher.trigger(`restaurant-${order.restaurantId}`, 'order-updated', {
        orderId: order.id,
        status: order.status,
      })
    } catch (pusherError) {
      console.error('Pusher error (non-critical):', pusherError)
      // Continue even if Pusher fails
    }

    return NextResponse.json(
      {
        success: true,
        order,
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

    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}


