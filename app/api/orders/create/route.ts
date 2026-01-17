import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateOrderSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string(),
      creationName: z.string(),
      restaurantName: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })
  ),
  deliveryAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().min(4),
  }),
  paymentMethod: z.enum(['card', 'wallet', 'cash']),
  specialInstructions: z.string().optional(),
  total: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = CreateOrderSchema.parse(body)

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: validatedData.deliveryAddress.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validatedData.deliveryAddress.email,
          name: `${validatedData.deliveryAddress.firstName} ${validatedData.deliveryAddress.lastName}`,
          phone: validatedData.deliveryAddress.phone,
          role: 'CUSTOMER',
        },
      })
    }

    // Get the first restaurant from cart items (assuming all items from same restaurant for now)
    const restaurantName = validatedData.cartItems[0].restaurantName
    const restaurant = await prisma.restaurant.findFirst({
      where: { name: restaurantName },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        restaurantId: restaurant.id,
        status: 'PENDING',
        totalPrice: validatedData.total,
        deliveryAddress: `${validatedData.deliveryAddress.address}, ${validatedData.deliveryAddress.city} ${validatedData.deliveryAddress.zipCode}`,
        paymentMethod: validatedData.paymentMethod,
        specialInstructions: validatedData.specialInstructions || '',
        items: {
          create: validatedData.cartItems.map((item) => ({
            name: item.creationName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
