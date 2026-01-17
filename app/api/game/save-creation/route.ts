import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const saveCreationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  userId: z.string(),
  restaurantId: z.string(),
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      quantity: z.number().int().positive(),
      positionX: z.number().optional(),
      positionY: z.number().optional(),
      positionZ: z.number().optional(),
      rotation: z.number().optional(),
    })
  ),
  isPublic: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = saveCreationSchema.parse(body)

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: validatedData.restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Verify all ingredients exist and are available
    const ingredientIds = validatedData.ingredients.map((ing) => ing.ingredientId)
    const ingredients = await prisma.ingredient.findMany({
      where: {
        id: { in: ingredientIds },
        restaurantId: validatedData.restaurantId,
        isAvailable: true,
      },
    })

    if (ingredients.length !== ingredientIds.length) {
      return NextResponse.json(
        { error: 'Some ingredients are not available' },
        { status: 400 }
      )
    }

    // Create the creation with ingredients
    const creation = await prisma.userCreation.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        userId: validatedData.userId,
        restaurantId: validatedData.restaurantId,
        isPublic: validatedData.isPublic,
        ingredients: {
          create: validatedData.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            positionX: ing.positionX,
            positionY: ing.positionY,
            positionZ: ing.positionZ,
            rotation: ing.rotation,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        creation,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error saving creation:', error)
    return NextResponse.json(
      { error: 'Failed to save creation' },
      { status: 500 }
    )
  }
}


