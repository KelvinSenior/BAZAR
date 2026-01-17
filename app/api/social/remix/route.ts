import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const remixCreationSchema = z.object({
  userId: z.string(),
  originalCreationId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  modifications: z
    .array(
      z.object({
        ingredientId: z.string(),
        action: z.enum(['add', 'remove', 'modify']),
        quantity: z.number().int().positive().optional(),
        positionX: z.number().optional(),
        positionY: z.number().optional(),
        positionZ: z.number().optional(),
        rotation: z.number().optional(),
      })
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = remixCreationSchema.parse(body)

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch original creation
    const originalCreation = await prisma.userCreation.findUnique({
      where: { id: validatedData.originalCreationId },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        restaurant: true,
      },
    })

    if (!originalCreation) {
      return NextResponse.json({ error: 'Original creation not found' }, { status: 404 })
    }

    // Check if creation is public or user owns it
    if (!originalCreation.isPublic && originalCreation.userId !== validatedData.userId) {
      return NextResponse.json(
        { error: 'Cannot remix private creation' },
        { status: 403 }
      )
    }

    // Create remixed creation based on original
    const remixedIngredients = originalCreation.ingredients.map((ing) => ({
      ingredientId: ing.ingredientId,
      quantity: ing.quantity,
      positionX: ing.positionX ?? undefined,
      positionY: ing.positionY ?? undefined,
      positionZ: ing.positionZ ?? undefined,
      rotation: ing.rotation ?? undefined,
    }))

    // Apply modifications if provided
    if (validatedData.modifications) {
      validatedData.modifications.forEach((mod) => {
        if (mod.action === 'add') {
          remixedIngredients.push({
            ingredientId: mod.ingredientId,
            quantity: mod.quantity || 1,
            positionX: mod.positionX,
            positionY: mod.positionY,
            positionZ: mod.positionZ,
            rotation: mod.rotation,
          })
        } else if (mod.action === 'remove') {
          const index = remixedIngredients.findIndex(
            (ing) => ing.ingredientId === mod.ingredientId
          )
          if (index > -1) {
            remixedIngredients.splice(index, 1)
          }
        } else if (mod.action === 'modify') {
          const index = remixedIngredients.findIndex(
            (ing) => ing.ingredientId === mod.ingredientId
          )
          if (index > -1) {
            remixedIngredients[index] = {
              ...remixedIngredients[index],
              quantity: mod.quantity || remixedIngredients[index].quantity,
              positionX: mod.positionX ?? remixedIngredients[index].positionX,
              positionY: mod.positionY ?? remixedIngredients[index].positionY,
              positionZ: mod.positionZ ?? remixedIngredients[index].positionZ,
              rotation: mod.rotation ?? remixedIngredients[index].rotation,
            }
          }
        }
      })
    }

    // Create the remixed creation
    const remixedCreation = await prisma.userCreation.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        userId: validatedData.userId,
        restaurantId: originalCreation.restaurantId,
        isPublic: true, // Remixes are public by default
        ingredients: {
          create: remixedIngredients,
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

    // Create remix record
    await prisma.remix.create({
      data: {
        userId: validatedData.userId,
        originalCreationId: validatedData.originalCreationId,
        remixedCreationId: remixedCreation.id,
      },
    })

    // Update remix count on original creation
    await prisma.userCreation.update({
      where: { id: validatedData.originalCreationId },
      data: {
        remixesCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        creation: remixedCreation,
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

    console.error('Error remixing creation:', error)
    return NextResponse.json(
      { error: 'Failed to remix creation' },
      { status: 500 }
    )
  }
}


