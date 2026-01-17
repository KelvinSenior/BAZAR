import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    const creations = await prisma.userCreation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ creations }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user creations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creations' },
      { status: 500 }
    )
  }
}


