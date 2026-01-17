import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get('sort') || 'popular'

    const orderBy =
      sort === 'popular'
        ? [{ likesCount: 'desc' as const }, { remixesCount: 'desc' as const }]
        : [{ createdAt: 'desc' as const }]

    const creations = await prisma.userCreation.findMany({
      where: {
        isPublic: true,
      },
      orderBy,
      take: 50,
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
          },
        },
      },
    })

    return NextResponse.json({ creations }, { status: 200 })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  }
}


