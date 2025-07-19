import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  generateImageWithDALLE, 
  generateImageWithStability, 
  generateMockImage 
} from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, provider = 'mock' } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // ユーザーのサブスクリプションと使用状況をチェック
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        generations: {
          where: {
            type: 'image',
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        }
      }
    })

    if (!user?.subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 403 })
    }

    // 使用制限チェック
    const monthlyGenerations = user.generations.length
    const isFreePlan = user.subscription.plan === 'free'
    const freeLimit = 2

    if (isFreePlan && monthlyGenerations >= freeLimit) {
      return NextResponse.json({ 
        error: 'Monthly limit reached. Please upgrade to continue generating images.',
        limit: freeLimit,
        used: monthlyGenerations 
      }, { status: 403 })
    }

    // 生成記録を作成
    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        type: 'image',
        prompt,
        status: 'pending'
      }
    })

    // AI画像生成
    let result
    try {
      switch (provider) {
        case 'dalle':
          result = await generateImageWithDALLE({ prompt })
          break
        case 'stability':
          result = await generateImageWithStability({ prompt })
          break
        default:
          result = await generateMockImage({ prompt })
      }

      if (!result.success) {
        await prisma.generation.update({
          where: { id: generation.id },
          data: { status: 'failed' }
        })
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      // 生成成功時の更新
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: 'completed',
          result: result.data?.url
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          id: generation.id,
          url: result.data?.url,
          prompt,
          createdAt: generation.createdAt
        },
        usage: {
          used: monthlyGenerations + 1,
          limit: isFreePlan ? freeLimit : null,
          plan: user.subscription.plan
        }
      })

    } catch (error) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: 'failed' }
      })
      throw error
    }

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}