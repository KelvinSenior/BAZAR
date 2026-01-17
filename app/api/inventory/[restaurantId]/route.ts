import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params

    const ingredients = await prisma.ingredient.findMany({
      where: {
        restaurantId,
      },
      orderBy: [
        { isAvailable: 'desc' },
        { category: 'asc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
        isAvailable: true,
        category: true,
        price: true,
        image: true,
      },
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


