import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 現在の月の開始日を取得
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // ユーザーの使用状況を取得
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        generations: {
          where: {
            createdAt: {
              gte: startOfMonth
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 画像と動画の使用数を計算
    const imageGenerations = user.generations.filter(g => g.type === 'image')
    const videoGenerations = user.generations.filter(g => g.type === 'video')

    const isFreePlan = user.subscription?.plan === 'free'
    const limits = {
      image: isFreePlan ? 2 : null, // 無制限の場合はnull
      video: isFreePlan ? 1 : null
    }

    const usage = {
      image: {
        used: imageGenerations.length,
        limit: limits.image,
        remaining: limits.image ? Math.max(0, limits.image - imageGenerations.length) : null
      },
      video: {
        used: videoGenerations.length,
        limit: limits.video,
        remaining: limits.video ? Math.max(0, limits.video - videoGenerations.length) : null
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        plan: user.subscription?.plan || 'free',
        usage,
        generations: user.generations.map(g => ({
          id: g.id,
          type: g.type,
          prompt: g.prompt,
          status: g.status,
          result: g.result,
          createdAt: g.createdAt
        })),
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1) // 次の月の1日
      }
    })

  } catch (error) {
    console.error('Usage fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}